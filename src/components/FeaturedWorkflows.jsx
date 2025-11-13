import { Box, Container, Typography, Card, CardContent, Chip, Grid } from '@mui/material';

const workflows = [
  {
    title: 'Deployment Automation',
    status: 'Active',
    description: 'End-to-end CI/CD pipelines for seamless deployments',
  },
  {
    title: 'Infrastructure as Code',
    status: 'Active',
    description: 'Secure baselines and configuration management',
  },
  {
    title: 'Monitoring & Alerting',
    status: 'Active',
    description: 'Proactive incident detection and resolution',
  },
  {
    title: 'Container Orchestration',
    status: 'In Progress',
    description: 'Docker and Kubernetes deployment strategies',
  },
];

export default function FeaturedWorkflows() {
  return (
    <Box
      component="section"
      id="workflows"
      sx={{
        py: { xs: 8, md: 12 },
        background: '#ffffff',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.15em',
              mb: 1,
              display: 'block',
            }}
          >
            FEATURED WORKFLOWS
          </Typography>
          <Typography variant="h3" gutterBottom fontWeight={700}>
            Tools & Methodologies
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {workflows.map((workflow, index) => (
            <Grid key={index} item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0, 87, 255, 0.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Chip
                    label={workflow.status}
                    size="small"
                    sx={{
                      mb: 2,
                      bgcolor: workflow.status === 'Active' ? 'success.light' : 'warning.light',
                      color: workflow.status === 'Active' ? 'success.dark' : 'warning.dark',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {workflow.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {workflow.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
