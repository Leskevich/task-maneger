import React, {useCallback, useEffect} from 'react'
import './App.css'
import {TodolistsList} from 'features/TodolistsList/TodolistsList'
import {ErrorSnackbar} from 'common/components/ErrorSnackbar/ErrorSnackbar'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from './store'
import {appThunk, RequestStatusType} from './app-reducer'
import {Navigate, Route, Routes} from 'react-router-dom'

import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@mui/material';
import {Menu} from '@mui/icons-material'
import {Login} from "features/Login/Login";
import {authThunk} from "features/Login/auth-reducer";


type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch<any>()

    useEffect(() => {
        dispatch(appThunk.me())
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(authThunk.logout())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<div>404</div>}/>
                    <Route path={'*'} element={<Navigate to={"/404"}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
