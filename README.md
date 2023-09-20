# Queue Underflow
> Contributors:\
> James Leonardi - <jamesl8421@gmail.com>\
> Kevin Tao - <kevin.tao@stonybrook.edu>

## Instructions to setup and run project
Make a MongoDB database called fake_so and start it.

A script called server/init.js is included in the repository that will be run to create initial data in our schema. This script will be run using Node before starting the server. The initial data contains the user profile for admin. The username and password for an admin user must be provided as the first argument to server/init.js. These credentials are used to create a user profile for admin in the database.

Start the express server with node server.js

Start the client with npm start

Navigate to localhost:3000

## Additional Libraries
- bcrypt
- jsonwebtoken


## Credits
### James Leonardi
> **Landing Page, Login/Signup Pages, Profile Pages (and all related components), Admin Profiles** - showing/editing/deleting asked questions, showing answered questions, showing/editing/deleting answers, deleting users, showing/editing/deleting tags
>
> **Answer Page** - Implemented the answer page, including the replacement of hyperlinks within the text.
>
> **Post a New Answer** - Implemented Post a New Answer page.
>
> **All Tags Page** - Implemented All Tags Page, including 3-column/row rule.
>
> **Filter by Tag** - Implemented filtering by a tag, used in All Tags Page.

### Kevin Tao
> **Pages, Answer Page Tags, Comments, Reputation, Sessions, Error messages** - Updated lists to show pages of items at a time, updated the answers page, added comments, implemented the reputation system for questions/answers/comments, set up sessions, added the error message banner, wrote the init script, drew the UML diagram.
>
> **Home Page** - Designed the overall structure of the website, and implemented the Header/Sidebar/Question List and their associated functions.
>
> **Post a New Question** - Implemented the Post New Question form, including validation of user input.
> 
> **Search by Text** - Implemented searching by text. Relatively unchanged from HW1.
> 
> **Search by Tag** - Implemented searching by tag. Relatively unchanged from HW1.