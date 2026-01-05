# CSCI 5117 Fall 2025 -- Module 2 Homework


Instructions can be [found on canvas](https://canvas.umn.edu/courses/518559/pages/homework-2)

Please fill out all of the following sections to help us grade your submission:

## Student (to be completed individually)

* First Last, sing0931@umn.edu

## Link to Site

(https://todo-6f5d8.web.app/)

## Challenge Task

* I started the challenge task: Yes
* I completed the challenge task: Yes


## Any Extra Notes?
- / :
  - splash page with google login and Baanee's Todo App
  - if you try to hit any other pages without being logged in (except 404), you will be redirected back here
- /done & /done/:category :
  - filter Categories for the Done Page only pop up when you have categories, otherwise it will just be a page of completed todos (that are not associated with a category which means they cannot be filtered)
  - the filled in checkmark indicates that the todo is done (if you click the checkbox, the todo will be marked undone and active)
  - you can also delete a done todo
  - these todos also hyperlink to /todos/:id which means you can edit a completed todo 
- /todos/:id :
  - editing the todo item's text will be saved automatically
  - you can delete a todo
  - mark a todo as done (or undone if you are looking at a done todo)
  - change the category of a todo item
  - also look at the data associated with the todo (category, status, created, completed (if todo is marked as done))
- /todos & /todos/:category :
  - the app will use the first name associated with your google login as the header for the app (ex. Baanee's Todos) 
  - the form of the todo will also allow you to create a new category at the same time as you are writing your todo (+ New Category)
  - you can delete the todo with the delete button
  - check box is empty to indicate that the todo is not done
  - if your todo has no category (or if you delete the category associated with a todo) there will be no tag or bubble next to the delete button
  - you can filter not done todos by category (todos no longer associated with a category will only appear in all categories selection)
  - you can create categories and delete them as well
  - if you click on a category to filter the todos, the todo form will also update to allow you to submit a todo in that category
- /404 :
  - if you are not logged in and hit the 404 page, you can click the button that says go to todos that will redirect you back to the splash page. 
- FINALLY, the app is pink because I made a similar todo app in 4131 and that was pink so I'm carrying on the tradition
