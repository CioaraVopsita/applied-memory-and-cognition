# Front and back end web development (JavaScript and Node.js) and database management (PostgreSQL)

Example of combining Javascript for front-end development with Node.js for back-end development to make an application more readable and easier to modify.

## Prerequisites

- Node.js 
- PostgreSQL

## Running the app

- Run **express.js** in a terminal. This handles all webpage requests.
- **randomallocation.js** is a Node.js feature that allows each individual accessing the app to be allocated to a random experimental condition. To prevent a low probability overloading of one of the conditions, once a specified target number of visitors is reached in any of the conditions, the condition is removed.
- **line-up.js** handles the appropriate allocation of certain variables to the correct individual.
- All webpages can be found in the *public* folder. Some of the JavaScript features they contain include: 
  - preventing page refresh or clicking back
  - Tetris game
  - photo and video along with automatic page timeout
  - "memory" of client-side code execution and future replay

## Specifics
- The number of conditions can be changed in **randomallocation.js** by creating/removing an instance of the *condition* class.

## Authors
- Nicoleta Condruz - feedback and movement decomposition algorithms

## Acknowledgments 
Very grateful to Dr. Melissa Colloff who has had infinite patience with my experimentation.
