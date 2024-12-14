# Final Project Instructions: Building an Chat Application

## Objective

This project involves building a real-time chat application using `Node.js`. The backend will utilize either `PostgreSQL` or `MongoDB` as the database. The goal is to create a fully functional chat application that allows multiple users to join chat rooms, exchange messages, and view chat history.

## Group Formation

- **Team Size**: <= 4 members per group.
- **Collaboration**: Use version control (e.g., GitHub) to manage the codebase collaboratively.

## Tech Stack & Architecture

1. **`TypeScript`**

2. **`Express`**

3. **`Web Sockets` (Socket.io)**

4. **`MVC` (where applicable)**

5. **`Database` - `Postgres` / `MongoDB`**

6. **`ORM / ODM` - `Prisma` / `Mongoose`**

7. **`EJS` / `HTML`** (Other tools must be discussed in advance)

8. **`CSS` / `SASS` / `Others`** (Anything)

9. **`Bcrypt` + `Cookie-Session`.**

## Features

### Minimum Requirements:

1. **User Authentication with session management. (Protected Routes)**

2. **Real-Time messaging between users.**

3. **Persistence of chat history in the database**.

4. **Ability to join and leave groups for chats**.

### Bonus:

1. **Work with additional data per user and per group (Display Picture, Description, etc).**

2. **Categorize users as either group members or group admins.**

3. **Add ability to send images or other type of media in chats.**

## Database Requirements

1. Plan and Draw an efficient `ERD` (Entity Relationship Diagram)

   - Mention the following:

     - Entities

     - Attribute Names

     - Attribute Types

     - Attribute Constraints

     - Relationships

1. Have at least **`4 Entities`** (`Tables` / `Documents`)

1. Setup appropriate `Migrations` and `Seeds`

## Project Structure

```ts
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── views
│   ├── app.ts
│   ├── index.ts
│   └── ...
├── public
│   ├── css
│   ├── js
│   └── ...
├── .env
├── package.json
├── tsconfig.json
├── README.md
└── ...
```

## Resources

1.  [Express Documentation](https://expressjs.com/)

2.  [Socket.IO Documentation](https://socket.io/docs/v4/)

3.  [EJS Documentation](https://ejs.co/)

4.  [PostgreSQL Documentation](https://www.postgresql.org/docs/)

5.  [Prisma Documentation](https://www.prisma.io/docs/)

6.  [MongoDB Documentation](https://docs.mongodb.com/)

7.  [Mongoose Documentation](https://mongoosejs.com/docs/)

8.  [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

9.  [Cookie-Session Documentation](https://www.npmjs.com/package/cookie-session)

10. [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Evaluation Criteria

- **Functionality**: How well the features are implemented and work together.
- **Code Quality**: Adherence to best practices and code organization.
- **Design**: User interface and user experience.
- **Documentation**: Clarity and completeness of the README and comments in the code.
- **Presentation**: Effectiveness and clarity of the presentation.
- and more...

## Presentation Instructions - Reference Only, you can always make it more interesting

1. **Presentation Format**:

   - Each group will present their project in a 15-minute presentation.
   - Use slides to support your presentation (e.g., Google Slides, PowerPoint).

2. **Content**:

   - **Introduction**: Introduce your team and provide an overview of the project.
   - **Features**: Demonstrate the key features of your e-commerce website.
   - **Technical Details**: Explain the architecture, key technologies used, and any challenges faced.
   - **Live Demo**: Show a live demo of your application, highlighting the main functionalities.
   - **Conclusion**: Summarize the project and discuss any future improvements or additional features.

3. **Q&A**:
   - Be prepared to answer questions from the audience and the instructor.

## Deadline

- To be posted by Instructor. 

## Potential Guest to the presentation day

- Grayce, Career Development Specialist may be with us while you are presenting this project.
- This opportunity may help her to understand better about you for your future job hunting.



## MVP (Minimum Viable Product)

- Product with just enough features to satisfy early customers
- Decide which features will be part of the MVP.
- Keep as simple as possible
- Get feedback and continue development

## Wireframes

- Low-fidelity,
- Simple sketches of the user interface without graphics or colours.
- Plan the layout and prioritize content and functionalities.

## Mock Design

> You came to this program to learn how to be a developer, not a designer. However, it is important to have a good design. You can use a tool like Figma to create your design.

- Hi-fidelity
- Websites for inspiration:
  - [Dribbble](https://dribbble.com/)
  - [Behance](https://www.behance.net/)
  - [Pinterest](https://www.pinterest.ca/)
  - [Awwwards](https://www.awwwards.com/)
  - [CSS Design Awards](https://www.cssdesignawards.com/)
  - [V0 by Vercel](https://v0.dev/) **⚠️ WARNING: You have to PAY after certain usage.**

**Cool idea:** Try to talk to UI/UX students and ask some advices for your product design.

## Project management

- Use a project management tool like GitHub Projects.
- Create a board for your project
- Add tasks/issues based on your user stories
- Allocate tasks to team members
- Estimate tasks and set due dates (it is ok to change them later)

## Communication

- Use a communication tool like Slack.
- Create a chatroom for your project
- Add team members
- Invite your instructor to the chatroom
- Use the channel to communicate
- Daily standup
  - What did you do yesterday?
  - What are you going to do today?
  - Do you have any blockers?

## Please keep in mind!!

- if something fails in your team, it is not one of your team members' failures but a WHOLE TEAM.
- if you do not want to lead, follow the lead
- Decide as a team
- Be responsive - no longer than half a day
- Please flag if you think you are behind
- If you are stuck on a problem for more than 1 hour, It is time to ask for help
- Take action instead of thinking too long

Good luck! If you have any questions, feel free to reach out to your instructor.