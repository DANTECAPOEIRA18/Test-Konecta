import { FC, useEffect, useRef } from 'react'
import { Box, Paper, Typography, TextField, IconButton, Stack, Tooltip } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { format } from 'date-fns'
import { ChatWindowProps } from './ChatWindow.Types'
import { useChatWindow } from './ChatWindow.hook'

const ChatWindow: FC<ChatWindowProps> = ({ meId, peer, messages, onSend, onSendFile }) => {
  const { 
    handleKeyDown, 
    handleSend, 
    handleSetText, 
    text, 
    fileRef, 
    chooseFile, 
    uploadAndSend,
    bottomRef,
    scrollToBottom } = useChatWindow({ peer, meId, messages, onSend, onSendFile })



  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,           // <— important for scroll in flex/grid parents
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        {peer ? `Chat with ${peer.nick}` : 'Select a user to start chatting'}
      </Typography>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,         // <— allow this child to shrink
          overflowY: 'auto',    // <— show vertical scrollbar when needed
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pr: 0.5,
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
        }}
      >
        {messages.map((m, idx) => {
          const mine = m.from === meId
          const isFile = m.kind === 'file' && m.file
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
                {isFile ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {m.file!.mime.startsWith('image/') ? (
                      <Box component="a" href={m.file!.url} target="_blank" rel="noreferrer">
                        <Box
                          component="img"
                          src={m.file!.url}
                          alt={m.file!.name}
                          sx={{ maxWidth: 360, width: '100%', borderRadius: 1 }}
                          onLoad={() => scrollToBottom('auto')}
                        />
                      </Box>
                    ) : (
                      <Box
                        component="a"
                        href={m.file!.url}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}
                      >
                        <InsertDriveFileIcon fontSize="small" />
                        <Typography variant="body2">{m.file!.name}</Typography>
                      </Box>
                    )}
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {format(new Date(m.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{m.content}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                      {format(new Date(m.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </Typography>
                  </>
                )}
              </Paper>
            </Box>
          )
        })}
        <div ref={bottomRef} />
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf,.xls,.xlsx"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) uploadAndSend(f)
            if (fileRef.current) fileRef.current.value = ''
          }}
        />
        <Tooltip title="Attach file or image">
          <IconButton onClick={chooseFile} disabled={!peer}><AttachFileIcon /></IconButton>
        </Tooltip>
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

export default ChatWindow
