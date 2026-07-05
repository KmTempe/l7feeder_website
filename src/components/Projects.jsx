import { Box, Button, Chip, Container, Typography, IconButton, Tooltip } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default function Projects({ projects }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    if (!projects || projects.length === 0) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Box
            component="section"
            id="projects"
            sx={{
                py: { xs: 6, md: 10 },
            }}
        >
            <Container maxWidth="lg">
                <Box ref={ref} sx={{ mb: 4, textAlign: 'left' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '"03."',
                                        color: 'primary.main',
                                        fontFamily: '"Fira Code", monospace',
                                        fontSize: '1.5rem',
                                        mr: 2,
                                        fontWeight: 400,
                                    },
                                    '&::after': {
                                        content: '""',
                                        width: '300px',
                                        height: '1px',
                                        bgcolor: 'rgba(136, 146, 176, 0.2)',
                                        ml: 3,
                                        display: { xs: 'none', sm: 'block' },
                                    },
                                }}
                            >
                                Some Things I&apos;ve Built
                            </Typography>
                        </Box>
                    </motion.div>
                </Box>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {projects.map((project, index) => {
                            const hasDiagram = Boolean(project.image?.src);
                            const hasDetails = hasDiagram || project.highlights?.length || project.technologies?.length || project.roadmap;

                            return (
                            <motion.div key={index} variants={itemVariants}>
                                <Box
                                    sx={{
                                        bgcolor: '#112240',
                                        p: 4,
                                        height: '100%',
                                        borderRadius: 2,
                                        gridColumn: project.featured ? { md: '1 / -1' } : 'auto',
                                        transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                fontSize: '1.1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                '&::before': {
                                                    content: '"▹"',
                                                    color: 'primary.main',
                                                    mr: 1,
                                                    fontSize: '1.2rem',
                                                }
                                            }}
                                        >
                                            {project.title}
                                        </Typography>
                                        {project.link && (
                                            <Tooltip title="Visit Website" placement="top">
                                                <IconButton
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        mt: -0.5,
                                                        mr: -1,
                                                        '&:hover': { color: 'primary.main' }
                                                    }}
                                                >
                                                    <OpenInNewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: hasDiagram ? { xs: '1fr', md: 'minmax(0, 0.95fr) minmax(0, 1.05fr)' } : '1fr',
                                            gap: hasDetails ? 3 : 0,
                                            alignItems: 'start'
                                        }}
                                    >
                                        {hasDiagram && (
                                            <Box>
                                                <Box
                                                    component="a"
                                                    href={project.image.src}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`Open ${project.title} stack diagram`}
                                                    sx={{
                                                        display: 'block',
                                                        border: '1px solid rgba(100, 255, 218, 0.18)',
                                                        borderRadius: 1,
                                                        bgcolor: '#0a192f',
                                                        overflow: 'hidden',
                                                        maxHeight: { xs: 280, md: 420 },
                                                        '&:focus-visible': {
                                                            outline: '2px solid',
                                                            outlineColor: 'primary.main',
                                                            outlineOffset: 3
                                                        }
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={project.image.src}
                                                        alt={project.image.alt}
                                                        loading="lazy"
                                                        sx={{
                                                            display: 'block',
                                                            width: '100%',
                                                            maxHeight: { xs: 280, md: 420 },
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                </Box>
                                                {project.image.caption && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: 'block',
                                                            mt: 1,
                                                            color: 'text.secondary'
                                                        }}
                                                    >
                                                        {project.image.caption}
                                                    </Typography>
                                                )}
                                                <Button
                                                    href={project.image.src}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<AccountTreeIcon />}
                                                    endIcon={<OpenInNewIcon />}
                                                    size="small"
                                                    sx={{
                                                        mt: 1.5,
                                                        px: 0,
                                                        color: 'primary.main',
                                                        justifyContent: 'flex-start'
                                                    }}
                                                >
                                                    View stack diagram
                                                </Button>
                                            </Box>
                                        )}

                                        <Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {project.description}
                                            </Typography>

                                            {project.highlights?.length > 0 && (
                                                <Box
                                                    component="ul"
                                                    sx={{
                                                        mt: 2,
                                                        mb: 0,
                                                        pl: 2.5,
                                                        color: 'text.secondary',
                                                        '& li': {
                                                            pl: 0.5,
                                                            mb: 1,
                                                            fontSize: '0.88rem',
                                                            lineHeight: 1.55
                                                        },
                                                        '& li::marker': {
                                                            color: 'primary.main'
                                                        }
                                                    }}
                                                >
                                                    {project.highlights.map((highlight) => (
                                                        <li key={highlight}>{highlight}</li>
                                                    ))}
                                                </Box>
                                            )}

                                            {project.technologies?.length > 0 && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 1,
                                                        mt: 2.5
                                                    }}
                                                >
                                                    {project.technologies.map((technology) => (
                                                        <Chip
                                                            key={technology}
                                                            label={technology}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(100, 255, 218, 0.08)',
                                                                border: '1px solid rgba(100, 255, 218, 0.16)',
                                                                color: 'primary.main',
                                                                fontFamily: '"Fira Code", monospace',
                                                                fontSize: '0.7rem'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}

                                            {project.roadmap && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 2.5,
                                                        color: 'text.secondary',
                                                        fontSize: '0.88rem',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                        Ongoing:
                                                    </Box>{' '}
                                                    {project.roadmap}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </motion.div>
                            );
                        })}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
