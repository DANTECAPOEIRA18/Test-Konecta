import { useCallback, useEffect, useMemo, useRef, useState, FC } from 'react'
import { io, Socket } from 'socket.io-client'
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
} from '@mui/material'
import ChatWindow from '../Chatwindow/ChatWindow'
import imageBackGround from '../../../assets/imageBackGround.jpg'
import LoginHero from '../LoginHero/LoginHero'
import { useMaincomponent } from './MainComponent.hook'
import { getInitial } from './MainComponet.Types';




// --- App principal ---
const MainComponent : FC = () => {
  
  const {convo, handleConfirmNick, me, selected, send, socket, startChat, users} = useMaincomponent();

  return (
    <>
      <CssBaseline />

      {/* === Fondo azul glass para TODA la página (fuera de las cajas) === */}
      <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Capa base: gradientes azules */}
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
        {/* Capa glass: blur y saturación sobre el gradiente */}
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

        {/* Contenido de la app */}
        <Container maxWidth="lg" sx={{ py: 3, position: 'relative', zIndex: 1 }}>
          {/* Barra superior con avatar y nombre del usuario actual */}
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
            <LoginHero onConfirm={handleConfirmNick} heroUrl={imageBackGround}/>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 2, height: '70vh' }}>
              {/* Lista de usuarios */}
              <Paper sx={{ p: 2, overflow: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Connected users
                </Typography>
                <List dense>
                  {users.map((u) => (
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
                  ))}
                </List>
              </Paper>

              {/* Ventana de chat */}
              <ChatWindow meId={socket?.id || ''} peer={selected} messages={convo} onSend={send} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

export default MainComponent;
