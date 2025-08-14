import { FC } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material'
import { LoginHeroProps } from './LoginHero.Types'
import { useLoginHero } from './LoginHero.hook'

const LoginHero : FC<LoginHeroProps> = ({ onConfirm, heroUrl }) => {
  
  const {defaultHero, handleSetNick, handleSubmit, nick, canSubmit} = useLoginHero({onConfirm, heroUrl});

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        overflow: 'hidden',
        height: '70vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '30% 70%' },
        borderRadius: 4,
        boxShadow: (t) => t.shadows[3],
      }}
    >
      {/* 30% - Formulario */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Welcome
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a nickname to start chatting in real time.
          </Typography>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="Nickname"
            value={nick}
            onChange={(e) => handleSetNick(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            inputProps={{ maxLength: 24 }}
            helperText="2–24 characters"
            autoFocus
            fullWidth
          />
          <Button size="large" variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
            Enter chat
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Tip: you can change your nickname by refreshing this page.
        </Typography>
      </Box>

      {/* 70% - Hero con robot + glass blue */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: `
            radial-gradient(1200px 600px at 10% -10%, rgba(33, 150, 243, 0.35), transparent 60%),
            radial-gradient(800px 400px at 110% 110%, rgba(25, 118, 210, 0.35), transparent 60%),
            linear-gradient(135deg, #0D47A1 0%, #1976D2 45%, #42A5F5 100%)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Imagen */}
        <Box
          component="img"
          src={defaultHero}
          alt="Chat robot"
          sx={{
            width: { xs: '85%', md: '95%' },
            maxWidth: 880,
            objectFit: 'cover',
            filter: 'saturate(1.1) contrast(1.05)',
            transform: { md: 'translateY(6px)' },
            userSelect: 'none',
            pointerEvents: 'none',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,.35)',
          }}
        />
        {/* Capa glass */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.02) 100%)',
            backdropFilter: 'blur(1px) saturate(140%)',
            WebkitBackdropFilter: 'blur(1px) saturate(140%)',
            borderLeft: '1px solid rgba(255,255,255,.15)',
          }}
        />
        {/* Tarjeta glass flotante */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            px: 2.5,
            py: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.12)',
            color: '#fff',
            backdropFilter: 'blur(12px) saturate(160%)',
            WebkitBackdropFilter: 'blur(12px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 10px 40px rgba(0,0,0,.25)',
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 1.5 }}>
            Real-time Chat
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Powered by Socket.IO & NestJS
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default LoginHero;
