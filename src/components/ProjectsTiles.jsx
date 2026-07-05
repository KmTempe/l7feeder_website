import { Box, Button, Chip, Container, Typography, IconButton, Tooltip } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const featuredTileSx = {
    bgcolor: '#112240',
    border: '1px solid rgba(100, 255, 218, 0.12)',
    borderRadius: 1,
    p: { xs: 2.25, md: 2.75 },
    minHeight: 120,
    boxShadow: '0 10px 30px -18px rgba(2, 12, 27, 0.75)',
};

function ProjectHeader({ project, dense = false }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: dense ? 2 : 0 }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: dense ? '1.1rem' : { xs: '1.25rem', md: '1.45rem' },
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: 1.25,
                    '&::before': {
                        content: '"\\25B9"',
                        color: 'primary.main',
                        mr: 1,
                        fontSize: dense ? '1.2rem' : '1.35rem',
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
    );
}

function FeaturedProject({ project }) {
    const hasDiagram = Boolean(project.image?.src);

    return (
        <Box>
            <ProjectHeader project={project} />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        lg: 'repeat(6, minmax(0, 1fr))',
                    },
                    gridAutoRows: { lg: 'minmax(104px, auto)' },
                    gap: { xs: 1.5, md: 2 },
                    mt: 2,
                    alignItems: 'stretch',
                }}
            >
                {hasDiagram && (
                    <Box
                        sx={{
                            ...featuredTileSx,
                            gridColumn: { sm: 'span 2', lg: 'span 3' },
                            gridRow: { lg: 'span 3' },
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Box
                            component="a"
                            href={project.image.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${project.title} stack diagram`}
                            sx={{
                                display: 'block',
                                flex: 1,
                                minHeight: { xs: 260, md: 420 },
                                border: '1px solid rgba(100, 255, 218, 0.18)',
                                borderRadius: 1,
                                bgcolor: '#0a192f',
                                overflow: 'hidden',
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
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                justifyContent: 'space-between',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 1,
                            }}
                        >
                            {project.image.caption && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
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
                                    color: 'primary.main',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    px: 0,
                                }}
                            >
                                View stack diagram
                            </Button>
                        </Box>
                    </Box>
                )}

                <Box sx={{ ...featuredTileSx, gridColumn: { sm: 'span 2', lg: hasDiagram ? 'span 3' : 'span 6' } }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>
                        Summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.95rem', lineHeight: 1.65 }}>
                        {project.description}
                    </Typography>
                </Box>

                {project.highlights?.length > 0 && (
                    <Box sx={{ ...featuredTileSx, gridColumn: { sm: 'span 2', lg: 'span 3' } }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>
                            Operations
                        </Typography>
                        <Box
                            component="ul"
                            sx={{
                                mt: 1,
                                mb: 0,
                                pl: 2.5,
                                color: 'text.secondary',
                                '& li': {
                                    pl: 0.5,
                                    mb: 0.85,
                                    fontSize: '0.88rem',
                                    lineHeight: 1.5
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
                    </Box>
                )}

                {project.technologies?.length > 0 && (
                    <Box sx={{ ...featuredTileSx, gridColumn: { sm: 'span 2', lg: 'span 3' } }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>
                            Stack
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
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
                    </Box>
                )}

                {project.roadmap && (
                    <Box sx={{ ...featuredTileSx, gridColumn: { sm: 'span 2', lg: 'span 3' } }}>
                        <Typography variant="overline" sx={{ color: 'primary.main', fontFamily: '"Fira Code", monospace' }}>
                            Ongoing
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            {project.roadmap}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

function SimpleProjectCard({ project }) {
    return (
        <Box
            sx={{
                bgcolor: '#112240',
                p: 4,
                height: '100%',
                borderRadius: 2,
                transition: 'all 0.25s cubic-bezier(0.645,0.045,0.355,1)',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
                },
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <ProjectHeader project={project} dense />
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
        </Box>
    );
}

export default function ProjectsTiles({ projects, section = {} }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

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
            <Container maxWidth="xl">
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
                                        content: `"${section.number || '03.'}"`,
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
                                {section.title || "Some Things I've Built"}
                            </Typography>
                        </Box>
                    </motion.div>
                </Box>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        {projects.map((project, index) => (
                            <Box
                                component={motion.div}
                                key={project.title || index}
                                variants={itemVariants}
                                sx={{ gridColumn: project.featured ? { md: '1 / -1' } : 'auto' }}
                            >
                                {project.featured ? (
                                    <FeaturedProject project={project} />
                                ) : (
                                    <SimpleProjectCard project={project} />
                                )}
                            </Box>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
