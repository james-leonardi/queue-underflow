//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
const bcrypt = require('bcrypt')
const userArgs = process.argv.slice(2)
if (!userArgs[0] || !userArgs[1]) {
  console.log('Usage: node init.js <admin_email> <admin_password>')
  process.exit()
}

const adminEmail = userArgs[0]
let adminPassword = userArgs[1]
var adminUser
const Tag = require('./models/tags')
const User = require('./models/users')
const Comment = require('./models/comments')
const Answer = require('./models/answers')
const Question = require('./models/questions')

const mongoose = require('mongoose')
const mongoDB = 'mongodb://127.0.0.1:27017/fake_so'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

/** Create user 
 *
 * @param {string} name name of the tag
 * @param {User} user The user object
 * @returns {Tag}
 */
async function createTag (name, user) {
  const tag = new Tag({
    name: name,
    createdBy: user._id
  })
  const ntag = await tag.save()
  process.stdout.write('.')
  return ntag
}

/** Create user
 *
 * @param {string} email 
 * @param {string} username 
 * @param {string} password hashed password
 * @param {boolean} isAdmin 
 * @returns {User}
 */
async function createUser (email, username, password, isAdmin = false, rep = 0) {
  const hash = bcrypt.hashSync(password, 10)
  const user = new User({
    email: email,
    username: username,
    password: hash,
    created_date_time: Date.now(),
    reputation: (isAdmin) ? 9999 : rep,
    isAdmin: isAdmin
  })
  const nuser = await user.save()
  process.stdout.write('.')
  return nuser
}

/** Create question
 *
 * @param {string} title 
 * @param {string} text 
 * @param {Array<Tag._id>} tags 
 * @param {Array<Answer.id>} answers 
 * @param {User} asked_by 
 * @param {Date} ask_time 
 * @param {number} views 
 * @param {Array<User._id>} upvoters 
 * @param {Array<User._id>} downvoters 
 * @returns {Question}
 */
async function createQuestion (title, text, tags, answers, asked_by, ask_time, views, upvoters = [], downvoters = []) {
  const question = new Question({
    title: title,
    text: text,
    tags: tags,
    answers: answers,
    asked_by: asked_by.username,
    asked_by_email: asked_by.email,
    ask_date_time: ask_time,
    views: views,
    rep: upvoters.length - downvoters.length,
    upvoters: upvoters,
    downvoters: downvoters
  })
  const nquestion = await question.save()
  process.stdout.write('.')
  return nquestion
}

/** Create answer
 *
 * @param {string} text 
 * @param {User} answered_by 
 * @param {Date} answer_time 
 * @param {Array<Comment._id>} comments 
 * @param {Array<User._id>} upvoters 
 * @param {Array<User._id>} downvoters 
 * @returns {Answer}
 */
async function createAnswer(text, answered_by, answer_time, comments, upvoters = [], downvoters = []) {
  const answer = new Answer({
    text: text,
    ans_by: answered_by.username,
    ans_by_email: answered_by.email,
    ans_date_time: answer_time,
    comments: comments,
    reputation: upvoters.length - downvoters.length,
    upvoters: upvoters,
    downvoters: downvoters
  })
  const nanswer = await answer.save()
  process.stdout.write('.')
  return nanswer
}

/** Create comment
 *
 * @param {string} text 
 * @param {User} cum_by 
 * @param {Date} cum_date_time 
 * @param {Array<User._id>} voters 
 * @returns {Comment}
 */
async function createComment(text, cum_by, cum_date_time, voters = []) {
  const comment = new Comment({
    text: text,
    cum_by: cum_by.email,
    cum_date_time: cum_date_time,
    rep: voters.length,
    voters: voters
  })
  const ncomment = await comment.save()
  process.stdout.write('.')
  return ncomment
}

async function init_database () {
  /* Users */
  console.log("Creating users...")
  adminUser = await createUser(adminEmail, 'admin', adminPassword, true)
  const u1 = await createUser('mikeymike@gmail.com', 'mikeymike', 'dumbpass123', false, 100)
  const u2 = await createUser('jhuh@gmail.com', 'jason', 'passypasspass', false, 415)
  const u3 = await createUser('brick@gmail.com', 'Bricc', 'briccbricc', false, 69)
  const u4 = await createUser('tepstertomsper@outlook.com', 'Tom', 'password1', false, 12)

  /* Tags */
  console.log("\nCreating tags...")
  const t1 = await createTag('javascript', adminUser)
  const t2 = await createTag('python', adminUser)
  const t3 = await createTag('java', adminUser)
  const t4 = await createTag('c++', u1)
  const t5 = await createTag('c#', adminUser)
  const t6 = await createTag('html', u2)
  const t7 = await createTag('css', u4)
  const t8 = await createTag('react', u2)
  const t9 = await createTag('angular', u3)
  const t10 = await createTag('vue', u4)
  const t11 = await createTag('nodejs', u1)
  const t12 = await createTag('express', u2)
  const t13 = await createTag('mongodb', u2)
  const t14 = await createTag('sql', u2)

  /* Comments */
  console.log("\nCreating comments...")
  const c1 = await createComment('no', u1, Date.now(), [u2._id, u3._id, u4._id])
  const c2 = await createComment('I think that this is a good answer.', u2, Date.now(), [u4._id])
  const c3 = await createComment('bro frfr', u3, Date.now(), [u1._id])
  const c4 = await createComment('hey buddy!', u4, Date.now(), [u3._id])
  const c5 = await createComment('I agree..', u1, Date.now())
  const c6 = await createComment('why did you say that??', u2, Date.now(), [u1._id, u3._id])
  const c7 = await createComment('Indeed, I concur, my good sir.', u3, Date.now())
  const c8 = await createComment('I HOPE YOU HAVE A NICE CHRISTMAS', u1, Date.now(), [u2._id, u3._id, u4._id])
  const c9 = await createComment('My dad works at nintendo, and he\'s going to ban you from minecraft', u2, Date.now(), [u2._id])
  const c10 = await createComment('wait say sike right now', u3, Date.now(), [u1._id, u2._id, u4._id])
  const c11 = await createComment('lol nerd', u1, Date.now(), [u2._id])

  /* Answers */
  console.log("\nCreating answers...")
  const a1 = await createAnswer('You can make a for loop in javascript by using the for keyword.', u1, Date.now(), [c7._id], [u1._id, u2._id, u3._id, u4._id], [])
  const a2 = await createAnswer('You can make a list comprehension in python by using [] and writing a for loop inside of it.', u2, Date.now(), [c11._id], [u3._id, u4._id], [u1._id])
  const a3 = await createAnswer('Google.com', u1, Date.now(), [], [u4._id], [u1._id])
  const a4 = await createAnswer('My brain is too small to comprehend the concept of a for loop.', u2, Date.now(), [], [], [u1._id, u2._id, u3._id, u4._id])
  const a5 = await createAnswer('I think that for loops should be banned.', u3, Date.now(), [c2._id, c6._id, c4._id, c5._id, c8._id, c9._id, c10._id], [u1._id, u4._id], [])
  const a6 = await createAnswer('nah bro for loops are wicked', u1, Date.now(), [c3._id], [u2._id, u4._id], [u1._id])
  const a7 = await createAnswer('Even though I am missing both of my kneecaps, I think that for loops are pretty cool.', u4, Date.now(), [], [u3._id], [u1._id])

  /* Questions */
  console.log("\nCreating questions...")
  const q1 = await createQuestion('How do I make a for loop in javascript?', 'I want to make a for loop in javascript, but I don\'t know how. Can someone help me?', [t1._id, t11._id], [a1._id], u1, Date.now(), 10, [u1._id, u3._id, u4._id], [u2._id])
  const q2 = await createQuestion('How do I make a list comprehension in python?', 'I\'m trying to make a list comprehension in python, but I lack the ability to use google. Can someone help me?', [t2._id], [a2._id, a3._id], u2, Date.now(), 265, [u1._id, u2._id, u3._id, u4._id])
  const q3 = await createQuestion('There is a for loop in my house', 'I found a for loop in my house, but it killed my father. Can someone help me?', [t13._id], [a11._id, a6._id], u4, Date.now(), 110)
  const q4 = await createQuestion('Why are there so many for loops?', 'I want to make a for loop, but there are so many. Can someone help me?', [], [a4._id], u1, Date.now(), 3)
  const q5 = await createQuestion('There should be more government regulation on for loops', 'I think that for loops should be regulated by the government. They are too dangerous and cause widespread destruction. My great grandfather was killed by a for loop in the Sino-Japanese war. Can someone help me?', [t14._id], [a10._id, a5._id, a7._id], u2, Date.now(), 72547, [u1._id, u2._id, u3._id, u4._id])
  const q6 = await createQuestion('Where do I find the for loop in mongodb?', 'I can\'t find the for loop in mongodb. My life is over. Can someone help me?', [t13._id], [], u1, Date.now(), 12, [], [u2._id])
  console.log("\nDone!")
  return process.exit(0)
}

init_database()
