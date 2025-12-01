import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { portfolioData } from '../data/portfolioData';

// Font registration removed to use default fonts


const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        lineHeight: 1.5,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottom: '1px solid #ccc',
        paddingBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 700,
        color: '#112240',
        marginBottom: 8,
    },
    title: {
        fontSize: 14,
        color: '#00bfa5', // Darker shade of cyan for better readability on white
        marginBottom: 8,
        fontWeight: 700,
    },
    contactInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
        color: '#555',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 700,
        color: '#112240',
        borderBottom: '1px solid #eee',
        paddingBottom: 4,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    jobContainer: {
        marginBottom: 10,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    jobTitle: {
        fontWeight: 700,
        fontSize: 11,
    },
    company: {
        fontStyle: 'italic',
    },
    date: {
        color: '#666',
        fontSize: 9,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    bullet: {
        width: 10,
        fontSize: 10,
    },
    bulletContent: {
        flex: 1,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillCategory: {
        width: '100%',
        marginBottom: 4,
        fontWeight: 700,
        fontSize: 10,
    },
    skillList: {
        fontSize: 10,
        color: '#555',
        marginBottom: 8,
    },
});

const ResumeDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{portfolioData.name}</Text>
                <Text style={styles.title}>{portfolioData.title}</Text>
                <View style={styles.contactInfo}>
                    <Text>{portfolioData.email}</Text>
                    {/* Add phone or location if available in data, currently only email is there */}
                </View>
            </View>

            {/* About */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                {portfolioData.about.description.map((desc, index) => (
                    <Text key={index} style={{ marginBottom: 5 }}>
                        {desc}
                    </Text>
                ))}
            </View>

            {/* Experience */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {portfolioData.experience.map((job, index) => (
                    <View key={index} style={styles.jobContainer}>
                        <View style={styles.jobHeader}>
                            <Text style={styles.jobTitle}>{job.title}</Text>
                            <Text style={styles.date}>{job.period}</Text>
                        </View>
                        <Text style={[styles.company, { marginBottom: 4 }]}>{job.company}</Text>
                        {job.responsibilities.map((resp, i) => (
                            <View key={i} style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletContent}>{resp}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Education */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {portfolioData.education.map((edu, index) => (
                    <View key={index} style={styles.jobContainer}>
                        <View style={styles.jobHeader}>
                            <Text style={styles.jobTitle}>{edu.title}</Text>
                            <Text style={styles.date}>{edu.period}</Text>
                        </View>
                        <Text style={[styles.company, { marginBottom: 4 }]}>{edu.institution}</Text>
                        <Text>{edu.description}</Text>
                    </View>
                ))}
            </View>

            {/* Skills */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                    {Object.entries(portfolioData.skills).map(([category, skills]) => (
                        <View key={category} style={{ width: '50%', marginBottom: 10 }}>
                            <Text style={styles.skillCategory}>{category}</Text>
                            <Text style={styles.skillList}>{skills.join(', ')}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </Page>
    </Document>
);

export default ResumeDocument;
