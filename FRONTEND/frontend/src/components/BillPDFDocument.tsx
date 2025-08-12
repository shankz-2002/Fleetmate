import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Button } from '@mui/material';
import React from 'react';
import { saveAs } from 'file-saver';

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    header: {
        backgroundColor: '#1e3a8a',
        padding: 25,
        color: '#ffffff',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 14,
        color: '#e2e8f0',
        marginTop: 5,
    },
    billInfo: {
        alignItems: 'flex-end',
    },
    billNumber: {
        fontSize: 14,
        color: '#e2e8f0',
    },
    billDate: {
        fontSize: 12,
        color: '#cbd5e1',
        marginTop: 3,
    },
    content: {
        padding: 30,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 15,
        marginTop: 20,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#e2e8f0',
    },
    customerSection: {
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 11,
        color: '#64748b',
        width: 120,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 11,
        color: '#1e293b',
        flex: 1,
    },
    vehicleSection: {
        backgroundColor: '#fefefe',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    partsSection: {
        marginBottom: 20,
    },
    partsTable: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    tableHeaderCell: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#475569',
    },
    partNameHeader: {
        flex: 3,
    },
    quantityHeader: {
        flex: 1,
        textAlign: 'center',
    },
    costHeader: {
        flex: 2,
        textAlign: 'right',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    tableCell: {
        fontSize: 10,
        color: '#374151',
    },
    partName: {
        flex: 3,
    },
    quantity: {
        flex: 1,
        textAlign: 'center',
    },
    cost: {
        flex: 2,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    summarySection: {
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 8,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    summaryValue: {
        fontSize: 12,
        color: '#1e293b',
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: '#1e3a8a',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: '#1e3a8a',
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 16,
        color: '#1e3a8a',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 15,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 10,
        color: '#64748b',
    },
    managerText: {
        fontSize: 11,
        color: '#1e293b',
        fontWeight: 'bold',
    },
    remarksSection: {
        backgroundColor: '#fffbeb',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    remarksText: {
        fontSize: 10,
        color: '#92400e',
        fontStyle: 'italic',
    },
    icon: {
        fontSize: 12,
        marginRight: 8,
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

type Part = {
    partName: string;
    quantity: number;
    cost: number;
};

type Vehicle = {
    name: string;
    model: number;
    make: string;
    regNumber: string;
};

type BillPDFProps = {
    bill: {
        id: number;
        laborCharge: number;
        taxes: number;
        totalAmount: number;
        parts?: Part[];
        user: { name: string };
        appointment: {
            appointmentDate: string;
            remarks: string;
            vehicle: Vehicle;
        };
        manager: { name: string };
    };
};

const BillPDFDocument: React.FC<BillPDFProps> = ({ bill }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.logo}>FLEETMATE</Text>
                        <Text style={styles.subtitle}>Professional Auto Service</Text>
                    </View>
                    <View style={styles.billInfo}>
                        <Text style={styles.billNumber}>Invoice #{bill.id}</Text>
                        <Text style={styles.billDate}>
                            {new Date(bill.appointment.appointmentDate).toLocaleDateString('en-IN')}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Customer Information */}
                <Text style={styles.sectionHeader}>👤 Customer Information</Text>
                <View style={styles.customerSection}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Customer Name:</Text>
                        <Text style={styles.value}>{bill.user.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Service Date:</Text>
                        <Text style={styles.value}>
                            {new Date(bill.appointment.appointmentDate).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>

                {/* Vehicle Information */}
                <Text style={styles.sectionHeader}>🚗 Vehicle Details</Text>
                <View style={styles.vehicleSection}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Vehicle:</Text>
                        <Text style={styles.value}>{bill.appointment.vehicle.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Make:</Text>
                        <Text style={styles.value}>{bill.appointment.vehicle.make}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Model Year:</Text>
                        <Text style={styles.value}>{bill.appointment.vehicle.model}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Registration:</Text>
                        <Text style={styles.value}>{bill.appointment.vehicle.regNumber}</Text>
                    </View>
                </View>

                {/* Remarks */}
                {bill.appointment.remarks && (
                    <>
                        <Text style={styles.sectionHeader}>📝 Service Notes</Text>
                        <View style={styles.remarksSection}>
                            <Text style={styles.remarksText}>{bill.appointment.remarks}</Text>
                        </View>
                    </>
                )}

                {/* Parts Used */}
                {bill.parts && bill.parts.length > 0 && (
                    <>
                        <Text style={styles.sectionHeader}>🔧 Parts & Components</Text>
                        <View style={styles.partsSection}>
                            <View style={styles.partsTable}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderCell, styles.partNameHeader]}>
                                        Part Description
                                    </Text>
                                    <Text style={[styles.tableHeaderCell, styles.quantityHeader]}>
                                        Qty
                                    </Text>
                                    <Text style={[styles.tableHeaderCell, styles.costHeader]}>
                                        Amount (₹)
                                    </Text>
                                </View>
                                {bill.parts.map((part, index) => (
                                    <View style={styles.tableRow} key={index}>
                                        <Text style={[styles.tableCell, styles.partName]}>
                                            {part.partName}
                                        </Text>
                                        <Text style={[styles.tableCell, styles.quantity]}>
                                            {part.quantity}
                                        </Text>
                                        <Text style={[styles.tableCell, styles.cost]}>
                                            ₹{part.cost.toFixed(2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </>
                )}

                {/* Bill Summary */}
                <Text style={styles.sectionHeader}>💰 Payment Summary</Text>
                <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Labor Charges:</Text>
                        <Text style={styles.summaryValue}>₹{bill.laborCharge.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Parts Cost:</Text>
                        <Text style={styles.summaryValue}>
                            ₹{bill.parts?.reduce((sum, part) => sum + part.cost, 0).toFixed(2) || '0.00'}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Taxes & Fees:</Text>
                        <Text style={styles.summaryValue}>₹{bill.taxes.toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalValue}>₹{bill.totalAmount.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>
                        Thank you for choosing FleetMate! • www.fleetmate.com
                    </Text>
                    <Text style={styles.managerText}>
                        Service Manager: {bill.manager.name}
                    </Text>
                </View>
            </View>
        </Page>
    </Document>
);

const DownloadBillPDF: React.FC<BillPDFProps> = ({ bill }) => {
    const handleDownload = async () => {
        const blob = await pdf(<BillPDFDocument bill={bill} />).toBlob();
        saveAs(blob, `FleetMate_Invoice_${bill.id}.pdf`);
    };

    return (
        <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleDownload}
            sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
            }}
        >
            📄 Download Invoice
        </Button>
    );
};

export default DownloadBillPDF;