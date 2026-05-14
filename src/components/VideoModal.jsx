import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * VideoModal - Displays a video in a themed fullscreen-capable dialog.
 *
 * @param {boolean} open - Whether the modal is open
 * @param {function} onClose - Callback to close the modal
 * @param {string} videoUrl - The video source URL (Vercel Blob)
 * @param {string} title - Title displayed above the video
 */
export default function VideoModal({ open, onClose, videoUrl, title }) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          aria-labelledby="video-modal-title"
          slotProps={{
            paper: {
              sx: {
                bgcolor: '#0a192f',
                border: '1px solid rgba(100, 255, 218, 0.15)',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              },
              component: motion.div,
              initial: { opacity: 0, scale: 0.9, y: 20 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.9, y: 20 },
              transition: { duration: 0.3, ease: 'easeOut' },
            },
            backdrop: {
              sx: {
                backgroundColor: 'rgba(10, 25, 47, 0.85)',
                backdropFilter: 'blur(4px)',
              },
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
            }}
          >
            <Typography
              id="video-modal-title"
              variant="h6"
              sx={{
                color: 'primary.main',
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              {title || 'Video'}
            </Typography>
            <IconButton
              onClick={onClose}
              aria-label="Close video modal"
              sx={{
                color: '#8892b0',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#64ffda',
                  bgcolor: 'rgba(100, 255, 218, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Video Player */}
          <DialogContent
            sx={{
              p: 0,
              bgcolor: '#000',
              '&:last-child': { pb: 0 },
            }}
          >
            {videoUrl ? (
              <Box
                component="video"
                controls
                autoPlay
                playsInline
                preload="metadata"
                sx={{
                  width: '100%',
                  maxHeight: '70vh',
                  display: 'block',
                  outline: 'none',
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  color: '#8892b0',
                }}
              >
                <Typography variant="body2">
                  Video not available. Please check back later.
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
