import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function SnowflakeScaledEmbed({ open, preload, isMobile }) {
  const containerRef = useRef(null);

  const baseSize = useMemo(
    () => ({ width: 320, height: isMobile ? 520 : 240 }),
    [isMobile]
  );

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const el = containerRef.current;
      if (!el) return;

      const containerWidth = el.getBoundingClientRect().width || baseSize.width;
      const maxVisibleHeight =
        isMobile && typeof window !== 'undefined'
          ? Math.min(Math.round(window.innerHeight * 0.6), baseSize.height)
          : baseSize.height;

      const nextScale = Math.min(1, containerWidth / baseSize.width, maxVisibleHeight / baseSize.height);
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseSize.height, baseSize.width, isMobile]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        maxWidth: baseSize.width,
        borderRadius: 1.5,
        overflow: 'hidden',
        border: '1px solid rgba(100, 255, 218, 0.18)',
        bgcolor: '#081427',
        height: baseSize.height * scale,
      }}
    >
      <Box
        sx={{
          width: baseSize.width,
          height: baseSize.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <iframe
          title="Snowflake (Tor Project)"
          src="https://snowflake.torproject.org/embed.html"
          width={baseSize.width}
          height={baseSize.height}
          frameBorder="0"
          scrolling="no"
          loading={preload || open ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          style={{ display: 'block', width: baseSize.width, height: baseSize.height, border: 0 }}
        />
      </Box>
    </Box>
  );
}

export default function SnowflakeEmbedToggle({ preload = true }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(preload);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        sx={(theme) => ({
          position: 'fixed',
          top: isMobile ? 'auto' : 12,
          bottom: isMobile ? 'calc(12px + env(safe-area-inset-bottom))' : 'auto',
          right: 12,
          zIndex: theme.zIndex.modal + 2,
        })}
      >
        <Tooltip
          title={open ? 'Hide Snowflake widget' : 'Anti-censorship: open Snowflake widget'}
          placement="left"
          disableHoverListener={isMobile}
          disableFocusListener={isMobile}
        >
          <IconButton
            aria-label={open ? 'Hide Snowflake widget' : 'Open Snowflake widget'}
            onClick={() =>
              setOpen((v) => {
                const next = !v;
                if (next) setHasOpened(true);
                return next;
              })
            }
            sx={(theme) => ({
              width: isMobile ? 40 : 42,
              height: isMobile ? 40 : 42,
              borderRadius: '999px',
              border: '1px solid rgba(100, 255, 218, 0.30)',
              bgcolor: 'rgba(17, 34, 64, 0.92)',
              color: theme.palette.primary.main,
              boxShadow: open ? '0 10px 30px rgba(0,0,0,0.35)' : '0 8px 20px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(10px)',
              transition:
                'transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
              '&:hover': {
                bgcolor: 'rgba(17, 34, 64, 0.95)',
                transform: prefersReducedMotion ? 'none' : 'translateY(-2px)',
                borderColor: 'rgba(100, 255, 218, 0.5)',
              },
              '@keyframes snowflakeFloat': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-4px)' },
                '100%': { transform: 'translateY(0px)' },
              },
              animation:
                !prefersReducedMotion && !open ? 'snowflakeFloat 2.2s ease-in-out infinite' : 'none',
            })}
          >
            <ArrowDownwardRoundedIcon
              sx={{
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 180ms ease',
                fontSize: 20,
              }}
            />
          </IconButton>
        </Tooltip>

        {hasOpened && (
          <Paper
            elevation={12}
            role="dialog"
            aria-label="Snowflake widget"
            aria-hidden={!open}
            sx={{
              position: 'fixed',
              top: isMobile ? 'auto' : 60,
              bottom: isMobile ? 'calc(12px + env(safe-area-inset-bottom) + 48px)' : 'auto',
              right: 12,
              width: isMobile ? 'calc(100vw - 24px)' : 340,
              maxWidth: 'calc(100vw - 24px)',
              maxHeight: isMobile ? 'calc(100vh - 24px - env(safe-area-inset-bottom) - 48px)' : 'none',
              bgcolor: '#0b1c33',
              border: '1px solid rgba(100, 255, 218, 0.25)',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 18px 55px rgba(0,0,0,0.55)',
              transformOrigin: isMobile ? 'bottom right' : 'top right',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
              transform: open
                ? 'scale(1) translateY(0px)'
                : `scale(0.98) translateY(${isMobile ? '6px' : '-6px'})`,
              transition: prefersReducedMotion ? 'none' : 'opacity 160ms ease, transform 160ms ease',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.25,
                py: 0.75,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"Fira Code", monospace',
                    color: 'rgba(100, 255, 218, 0.95)',
                    fontWeight: 600,
                  }}
                >
                  Snowflake
                </Typography>
                <IconButton
                  aria-label="Open Snowflake website"
                  href="https://snowflake.torproject.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <OpenInNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              <IconButton aria-label="Close Snowflake widget" onClick={() => setOpen(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider sx={{ borderColor: 'rgba(100, 255, 218, 0.12)' }} />

            <Box sx={{ px: 1.25, py: 1 }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mb: 0.75, lineHeight: 1.35 }}
              >
                Keep this tab open to help others bypass censorship.
              </Typography>

              <SnowflakeScaledEmbed open={open} preload={preload} isMobile={isMobile} />
            </Box>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
