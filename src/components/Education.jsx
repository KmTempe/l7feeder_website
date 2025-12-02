import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Education({ education }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Box
            component="section"
            id="education"
            sx={{
                py: { xs: 6, md: 10 },
            }}
        >
            <Container maxWidth="lg">
                <Box ref={ref} sx={{ mb: 4 }}>
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
                                Education
                            </Typography>
                        </Box >
                    </motion.div >

                    <Box>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                        >
                            {education.map((edu, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Box
                                        sx={{
                                            mb: 4,
                                            display: 'grid',
                                            gridTemplateColumns: { md: '1fr 3fr' },
                                            gap: { xs: 1, md: 4 },
                                            '&:last-child': { mb: 0 },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: '"Fira Code", monospace',
                                                color: 'text.secondary',
                                                fontSize: '0.9rem',
                                                pt: 0.5,
                                            }}
                                        >
                                            {edu.period}
                                        </Typography>

                                        <Box>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: 'text.primary',
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    fontSize: '1.3rem',
                                                }}
                                            >
                                                {edu.title}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'primary.main',
                                                    fontFamily: '"Fira Code", monospace',
                                                    fontSize: '0.9rem',
                                                    mb: 2,
                                                }}
                                            >
                                                {edu.institution}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                                sx={{ mb: 2 }}
                                            >
                                                {edu.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            ))}
                        </motion.div>
                    </Box>
                </Box >
            </Container >
        </Box >
    );
}
