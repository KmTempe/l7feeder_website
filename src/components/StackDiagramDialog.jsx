import { Box, Button, Dialog, DialogContent, IconButton, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;
const PAN_STEP = 80;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const getPanBounds = (zoom) => ({
    x: Math.round(Math.max(0, (zoom - 1) * 640)),
    y: Math.round(Math.max(0, (zoom - 1) * 440)),
});

const constrainOffset = (offset, zoom) => {
    const bounds = getPanBounds(zoom);

    return {
        x: clamp(offset.x, -bounds.x, bounds.x),
        y: clamp(offset.y, -bounds.y, bounds.y),
    };
};

export default function StackDiagramDialog({ open, onClose, image, title }) {
    const dialogTitle = title ? `${title} stack diagram` : 'Stack diagram';
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStateRef = useRef(null);
    const panBounds = getPanBounds(zoom);

    const changeZoom = (delta) => {
        const nextZoom = clamp(Number((zoom + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM);

        setZoom(nextZoom);
        setOffset((currentOffset) => constrainOffset(currentOffset, nextZoom));
    };

    const panDiagram = (x, y) => {
        setOffset((currentOffset) => constrainOffset({
            x: currentOffset.x - x,
            y: currentOffset.y - y,
        }, zoom));
    };

    const resetView = () => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const handleClose = () => {
        resetView();
        onClose();
    };

    const handlePointerDown = (event) => {
        if (event.button !== 0) return;

        event.currentTarget.setPointerCapture(event.pointerId);
        dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            offsetX: offset.x,
            offsetY: offset.y,
        };
        setIsDragging(true);
    };

    const handlePointerMove = (event) => {
        if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return;

        setOffset(constrainOffset({
            x: dragStateRef.current.offsetX + event.clientX - dragStateRef.current.startX,
            y: dragStateRef.current.offsetY + event.clientY - dragStateRef.current.startY,
        }, zoom));
    };

    const endPointerDrag = (event) => {
        if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        dragStateRef.current = null;
        setIsDragging(false);
    };

    const handleWheel = (event) => {
        if (!event.shiftKey) return;

        event.preventDefault();
        changeZoom(event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP);
    };

    const controlButtonSx = {
        color: '#64ffda',
        border: '1px solid transparent',
        bgcolor: 'transparent',
        width: 36,
        height: 36,
        filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.85))',
        '&:hover': {
            color: '#64ffda',
            borderColor: 'rgba(100, 255, 218, 0.32)',
            bgcolor: 'rgba(2, 12, 27, 0.42)',
        },
        '&.Mui-disabled': {
            color: 'rgba(136, 146, 176, 0.38)',
            filter: 'none',
        },
    };

    const renderControl = (label, icon, onClick, disabled = false) => (
        <Tooltip title={label} placement="top">
            <span onPointerDown={(event) => event.stopPropagation()}>
                <IconButton
                    type="button"
                    size="small"
                    onClick={onClick}
                    disabled={disabled}
                    aria-label={label}
                    sx={controlButtonSx}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );

    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth={false}
                    fullWidth
                    aria-labelledby="stack-diagram-title"
                    aria-describedby={image?.caption ? 'stack-diagram-caption' : undefined}
                    slotProps={{
                        paper: {
                            sx: {
                                width: 'min(1180px, calc(100vw - 32px))',
                                maxHeight: 'calc(100vh - 32px)',
                                bgcolor: '#020c1b',
                                border: '1px solid rgba(100, 255, 218, 0.22)',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 28px 80px rgba(0, 0, 0, 0.72)',
                            },
                            component: motion.div,
                            initial: { opacity: 0, scale: 0.92, y: 24 },
                            animate: { opacity: 1, scale: 1, y: 0 },
                            exit: { opacity: 0, scale: 0.92, y: 24 },
                            transition: { duration: 0.28, ease: 'easeOut' },
                        },
                        backdrop: {
                            sx: {
                                backgroundColor: 'rgba(2, 12, 27, 0.88)',
                                backdropFilter: 'blur(5px)',
                            },
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            px: { xs: 2, md: 3 },
                            py: 1.75,
                            borderBottom: '1px solid rgba(100, 255, 218, 0.14)',
                            bgcolor: '#0a192f',
                        }}
                    >
                        <Typography
                            id="stack-diagram-title"
                            variant="h6"
                            sx={{
                                color: 'primary.main',
                                fontFamily: '"Fira Code", monospace',
                                fontSize: { xs: '0.84rem', sm: '0.95rem' },
                                fontWeight: 500,
                                lineHeight: 1.35,
                            }}
                        >
                            {dialogTitle}
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                            aria-label="Close stack diagram"
                            sx={{
                                color: '#8892b0',
                                flexShrink: 0,
                                '&:hover': {
                                    color: '#64ffda',
                                    bgcolor: 'rgba(100, 255, 218, 0.1)',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <DialogContent
                        sx={{
                            p: { xs: 1.5, md: 2 },
                            bgcolor: '#020c1b',
                            '&:last-child': { pb: { xs: 1.5, md: 2 } },
                        }}
                    >
                        {image?.src ? (
                            <Box
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={endPointerDrag}
                                onPointerCancel={endPointerDrag}
                                onWheel={handleWheel}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: { xs: '55vh', md: '68vh' },
                                    border: '1px solid rgba(100, 255, 218, 0.16)',
                                    borderRadius: 1,
                                    bgcolor: '#000814',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    touchAction: 'none',
                                    userSelect: 'none',
                                }}
                            >
                                <Box
                                    onPointerDown={(event) => event.stopPropagation()}
                                    sx={{
                                        position: 'absolute',
                                        top: { xs: 8, sm: 12 },
                                        left: { xs: 8, sm: 12 },
                                        zIndex: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.75,
                                        pointerEvents: 'auto',
                                    }}
                                >
                                    {renderControl('Zoom out diagram', <ZoomOutIcon fontSize="small" />, () => changeZoom(-ZOOM_STEP), zoom <= MIN_ZOOM)}
                                    <Typography
                                        aria-live="polite"
                                        sx={{
                                            minWidth: 48,
                                            textAlign: 'center',
                                            color: '#ccd6f6',
                                            fontFamily: '"Fira Code", monospace',
                                            fontSize: '0.78rem',
                                            lineHeight: '36px',
                                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.95)',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {Math.round(zoom * 100)}%
                                    </Typography>
                                    {renderControl('Zoom in diagram', <ZoomInIcon fontSize="small" />, () => changeZoom(ZOOM_STEP), zoom >= MAX_ZOOM)}
                                </Box>

                                <Box
                                    onPointerDown={(event) => event.stopPropagation()}
                                    sx={{
                                        position: 'absolute',
                                        right: { xs: 8, sm: 12 },
                                        bottom: { xs: 8, sm: 12 },
                                        zIndex: 2,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 36px)',
                                        gridTemplateRows: 'repeat(3, 36px)',
                                        gap: 0.5,
                                        pointerEvents: 'auto',
                                    }}
                                >
                                    <Box sx={{ gridColumn: 2, gridRow: 1 }}>
                                        {renderControl('Move diagram up', <KeyboardArrowUpIcon fontSize="small" />, () => panDiagram(0, -PAN_STEP), offset.y <= -panBounds.y)}
                                    </Box>
                                    <Box sx={{ gridColumn: 1, gridRow: 2 }}>
                                        {renderControl('Move diagram left', <KeyboardArrowLeftIcon fontSize="small" />, () => panDiagram(-PAN_STEP, 0), offset.x <= -panBounds.x)}
                                    </Box>
                                    <Box sx={{ gridColumn: 2, gridRow: 2 }}>
                                        {renderControl('Reset diagram view', <CenterFocusStrongIcon fontSize="small" />, resetView)}
                                    </Box>
                                    <Box sx={{ gridColumn: 3, gridRow: 2 }}>
                                        {renderControl('Move diagram right', <KeyboardArrowRightIcon fontSize="small" />, () => panDiagram(PAN_STEP, 0), offset.x >= panBounds.x)}
                                    </Box>
                                    <Box sx={{ gridColumn: 2, gridRow: 3 }}>
                                        {renderControl('Move diagram down', <KeyboardArrowDownIcon fontSize="small" />, () => panDiagram(0, PAN_STEP), offset.y >= panBounds.y)}
                                    </Box>
                                </Box>

                                <Box
                                    component="img"
                                    src={image.src}
                                    alt={image.alt || dialogTitle}
                                    draggable={false}
                                    onDragStart={(event) => event.preventDefault()}
                                    sx={{
                                        display: 'block',
                                        width: '100%',
                                        maxWidth: '1120px',
                                        maxHeight: { xs: '66vh', md: '74vh' },
                                        objectFit: 'contain',
                                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                        transformOrigin: 'center',
                                        transition: 'transform 0.2s ease',
                                        willChange: 'transform',
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 320,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="body2">Diagram unavailable.</Typography>
                            </Box>
                        )}

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                justifyContent: 'space-between',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 1.5,
                                mt: 1.5,
                            }}
                        >
                            {image?.caption && (
                                <Typography
                                    id="stack-diagram-caption"
                                    variant="caption"
                                    sx={{ color: 'text.secondary', lineHeight: 1.5 }}
                                >
                                    {image.caption}
                                </Typography>
                            )}
                            {image?.src && (
                                <Button
                                    href={image.src}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    endIcon={<OpenInNewIcon />}
                                    size="small"
                                    sx={{
                                        color: 'primary.main',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        px: 0,
                                    }}
                                >
                                    Open full size
                                </Button>
                            )}
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
}
