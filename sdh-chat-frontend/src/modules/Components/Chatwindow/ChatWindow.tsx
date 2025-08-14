import { useState, useCallback, useEffect, FC } from 'react'
import { Box, Paper, Typography, TextField, IconButton, Stack } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { format } from 'date-fns'
import { ChatWindowProps } from './ChatWindow.Types'
import { useChatWindow } from './ChatWindow.hook'


const ChatWindow : FC<ChatWindowProps> = ({ meId, peer, messages, onSend }: ChatWindowProps) => {

  const {handleKeyDown, handleSend, handleSetText, text} = useChatWindow({ peer, meId, messages, onSend })

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {peer ? `Chat with ${peer.nick}` : 'Select a user to start chatting'}
      </Typography>

      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((m, idx) => {
          const mine = m.from === meId
          return (
            <Box key={`${m.timestamp}-${idx}`} sx={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 1.2,
                  bgcolor: mine ? 'primary.main' : 'grey.200',
                  color: mine ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {format(new Date(m.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </Typography>
              </Paper>
            </Box>
          )
        })}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <TextField
          fullWidth
          placeholder={peer ? 'Type a message…' : 'Select a user first'}
          value={text}
          onChange={(e) => handleSetText(e.target.value)}
          disabled={!peer}
          onKeyDown={handleKeyDown}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!peer || !text.trim()}>
          <SendIcon />
        </IconButton>
      </Stack>
    </Paper>
  )
}

export default ChatWindow;