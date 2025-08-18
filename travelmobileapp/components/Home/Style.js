import { StyleSheet } from "react-native";

export default StyleSheet.create({
    // Layout styles
    container: {
        flex: 1,
    },
    
    // Header styles
    headerSection: {
        marginBottom: 20,
        marginTop: 10,
    },
    headerBackground: {
        width: '100%',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImageStyle: {
        borderRadius: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 25,
        paddingVertical: 20,
        borderRadius: 20,
        maxWidth: '90%',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    headerSubtitle: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        opacity: 0.95,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },

    // Search section styles
    searchSection: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    searchBar: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        elevation: 2,
    },

    // Category section styles
    categorySection: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    categoryContainer: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: 'center',
    },
    categoryChip: {
        margin: 6,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    categoryChipActive: {
        backgroundColor: '#54ACBF',
    },
    categoryChipInactive: {
        backgroundColor: '#e9ecef',
    },

    // Content section styles
    contentContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    
    // Empty state styles
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        minHeight: 400,
    },
    emptyContent: {
        backgroundColor: '#ffffff',
        padding: 40,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        maxWidth: '90%',
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 20,
        opacity: 0.6,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6c757d',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#adb5bd',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Loading styles
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#6c757d',
        fontWeight: '500',
    },

    // List styles
    listContainer: {
        paddingBottom: 20,
    },
    listHeader: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },

    // Stats section styles
    statsSection: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#54ACBF',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
    },

    // Welcome message styles
    welcomeContainer: {
        backgroundColor: '#e8f4fd',
        borderRadius: 20,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#54ACBF',
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 14,
        color: '#5a6c7d',
        lineHeight: 20,
    },
});