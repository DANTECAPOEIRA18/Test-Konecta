import { FC, useState, useMemo } from 'react'
import {
  AppBar,
  Toolbar,
  Avatar,
  Tooltip,
  Divider,
  Box,
  Container,
  CssBaseline,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Badge,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import ChatWindow from '../Chatwindow/ChatWindow'
import imageBackGround from '../../../assets/imageBackGround.jpg'
import LoginHero from '../LoginHero/LoginHero'
import { useMaincomponent } from './MainComponent.hook'
import { getInitial } from './MainComponet.Types'

// --- App principal ---
const MainComponent: FC = () => {
  const { 
    convo, 
    handleConfirmNick, 
    me, 
    selected, 
    send, 
    socket, 
    startChat, 
    filteredUsers,
    query,
    handleSetQuery, 
    sendFile } =
    useMaincomponent()

  return (
    <>
      <CssBaseline />
      {/* Fondo azul glass */}
      <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: `
              radial-gradient(1200px 600px at 10% -10%, rgba(33, 150, 243, 0.35), transparent 60%),
              radial-gradient(800px 400px at 110% 110%, rgba(25, 118, 210, 0.35), transparent 60%),
              linear-gradient(135deg, #0D47A1 0%, #1976D2 45%, #42A5F5 100%)
            `,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.02) 100%)',
            backdropFilter: 'blur(10px) saturate(140%)',
            WebkitBackdropFilter: 'blur(10px) saturate(140%)',
          }}
        />

        {/* Contenido */}
        <Container maxWidth="lg" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
          <AppBar position="static" elevation={0} color="transparent" sx={{ mb: 2 }}>
            <Toolbar sx={{ px: 0, display: 'flex', gap: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
                SDH Chat — Real-time
              </Typography>
              {me && (
                <Tooltip title={`Logged in as ${me.nick}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Avatar sx={{ width: 36, height: 36 }}>{getInitial(me.nick)}</Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {me.nick}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Toolbar>
            <Divider />
          </AppBar>

          {!me ? (
            <LoginHero onConfirm={handleConfirmNick} heroUrl={imageBackGround} />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: 2,
                height: '70vh',
                minHeight: 0, // permite que la columna se encoja y aparezca el scroll
              }}
            >
              {/* Panel de usuarios con buscador y lista scrollable */}
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0, // necesario para que la <List> pueda hacer scroll
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Connected users
                </Typography>

                {/* Buscador */}
                <TextField
                  size="small"
                  placeholder="Search user…"
                  value={query}
                  onChange={(e) => handleSetQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: query ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => handleSetQuery('')} edge="end">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  }}
                  sx={{ mb: 1 }}
                />

                {/* Lista con scroll */}
                <List
                  dense
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pr: 0.5,
                  }}
                >
                  {filteredUsers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                      No users found
                    </Typography>
                  ) : (
                    filteredUsers.map((u) => (
                      <ListItemButton
                        key={u.id}
                        selected={selected?.id === u.id}
                        onClick={() => startChat(u)}
                      >
                        <Badge
                          overlap="circular"
                          color="primary"
                          badgeContent={u.unreadCount ?? 0}
                          invisible={!u.unreadCount}
                          sx={{ mr: 1.25 }}
                        >
                          <Avatar sx={{ width: 28, height: 28 }}>{getInitial(u.nick)}</Avatar>
                        </Badge>
                        <ListItemText primary={u.nick} />
                      </ListItemButton>
                    ))
                  )}
                </List>
              </Paper>

              {/* Ventana de chat */}
              <ChatWindow
                meId={socket?.id || ''}
                peer={selected}
                messages={convo}
                onSend={send}
                onSendFile={sendFile}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

export default MainComponent
