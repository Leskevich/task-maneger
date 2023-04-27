import {thunkTodo, TodolistDomainType, todolistsReducer} from 'features/TodolistsList/todolist/todolists-reducer'
import {tasksReducer, TasksStateType} from 'features/TodolistsList/tasks/tasks-reducer'
import { TTodolist } from 'features/TodolistsList/todolist/todolistsAPI';


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let todolist: TTodolist = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }

    const action = thunkTodo.addTodo.fulfilled({todolist}, '', {title: 'new todolist'});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
