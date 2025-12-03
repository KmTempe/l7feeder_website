import { Box, Container, Typography, IconButton, Tooltip } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Projects({ projects }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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
                        {projects.map((project, index) => (
                            <motion.div key={index} variants={itemVariants}>
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
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
}
