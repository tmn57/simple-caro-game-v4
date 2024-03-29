import React from 'react'
import { connect } from 'react-redux'
import { makeStyles, Paper, Box, Typography, Snackbar, TextField, Container, CssBaseline, Button, IconButton, Avatar, ButtonBase } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions/Auth'
import Loading from '../components/Loading'
import { ArrowBack, Publish } from '@material-ui/icons'
import AvatarImg from '../components/AvatarImg'
import CustomSnackBar from '../components/CustomSnackBar'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    },
    paper: {
        width: '100%',
        padding: theme.spacing(3, 5)
    },
    avatarWrapper: {
        position: 'relative',
        minWidth: 100,
        minHeight: 100,
        '&:hover': {
            '& $avatarAbove': {
                display: 'block',
                opacity: 0.3
            }
        },
    },
    avatar: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        marginBottom: theme.spacing(3),
    },
    avatarAbove: {
        zIndex: 100,
        display: 'none',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: theme.palette.common.black,
        color: theme.palette.common.white,
        position: 'absolute',
    },
    item: {
        margin: theme.spacing(2)
    }
}))

const Profile = props => {
    const { postUpdateProfile, authState, authToken, updateAvatar } = props
    const { isAuthFetching, profilePayload, error } = authState
    const { username, avatarURL } = profilePayload
    const [updateProfilePayload, setUpdateProfilePayload] = React.useState({ username: '' })

    let avatarInputRef = React.useRef(null)

    const classes = useStyles()

    //Authenticating
    const [checkAuthing, setCheckAuthing] = React.useState(true)
    React.useEffect(() => {
        authToken().then(res => {
            if (!res) {
                props.history.push('/sign-in')
                setUpdateProfilePayload({ ...updateProfilePayload, username: username })
            } else {
                setCheckAuthing(false)
            }
        })
    }, [])

    if (checkAuthing) {
        return <Loading />
    }

    return (
        <Container maxWidth="xs" className={classes.container} component="main">
            <CssBaseline />
            <Paper className={classes.paper}>
                <IconButton href="/" aria-label="Quay lại trang chủ">
                    <ArrowBack />
                </IconButton>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center">
                    <Typography
                        className={classes.item}
                        component="h1"
                        variant="h5">
                        Thông tin tài khoản
                    </Typography>
                    <input id="avatarInput" type="file" ref={avatarInputRef} accept="image/x-png,image/jpeg" onChange={e => { updateAvatar(e.target.files[0]).then(() => { window.location.reload() }) }} style={{ display: 'none' }} />
                    <ButtonBase className={classes.avatarWrapper} onClick={() => { avatarInputRef.current.click() }}>
                        <Publish className={classes.avatarAbove} />
                        <Avatar className={classes.avatar} src={AvatarImg(avatarURL)} imgProps={{ onError: (e) => { e.target.src = AvatarImg() } }} />
                    </ButtonBase>
                    <TextField
                        className={classes.item}
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tên đăng nhập"
                        name="username"
                        autoFocus
                        disabled={isAuthFetching}
                        defaultValue={username}
                        onChange={event => { setUpdateProfilePayload({ ...updateProfilePayload, username: event.target.value }) }} />
                    <Button
                        className={classes.item}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            postUpdateProfile(updateProfilePayload).then(res => {
                                if (res.type = "POST_LOGIN_SUCCESS") {
                                    window.location.reload()
                                }
                            })
                        }}
                        disabled={isAuthFetching || updateProfilePayload.username === "" || updateProfilePayload.username === username}>
                        cập nhật tài khoản
                    </Button>
                    <Button
                        className={classes.item}
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            props.history.push('/profile/change-password')
                        }}
                        disabled={isAuthFetching}>
                        cập nhật password
                    </Button>
                </Box>
            </Paper>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={error !== "" && error}
                autoHideDuration={3333}>
                <CustomSnackBar
                    variant="error"
                    message={error}
                />
            </Snackbar>
        </Container >
    )
}

const mapStateToProps = state => {
    return {
        authState: state.authReducer
    };
};

export default connect(
    mapStateToProps,
    { ...actions }
)(withRouter(Profile));