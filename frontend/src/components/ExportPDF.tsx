import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Definisikan tipe data Props agar TypeScript tidak komplain
interface ExportPDFProps {
  data: any[];
}

const ExportPDF = ({ data }: ExportPDFProps) => {
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan Inventory Barang", 14, 22);
    doc.setFontSize(11);
    doc.text(`Dicetak pada: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["No", "Nama Barang", "Deskripsi", "Stok", "Harga", "Dibuat", "Tanggal Diperbarui"];
    
    const tableRows = data.map((p, index) => [
      index + 1,
      p.nama,
      p.deskripsi || "-",
      p.stok,
      `Rp ${Number(p.harga).toLocaleString()}`,
      p.tanggal_dibuat ? new Date(p.tanggal_dibuat).toLocaleDateString() : "-",
      p.tanggal_diperbarui ? new Date(p.tanggal_diperbarui).toLocaleString() : "-"
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save(`Laporan_${new Date().getTime()}.pdf`);
  };

  return (
    <button 
      onClick={handleDownload} 
      style={{ 
        backgroundColor: "#e74c3c", 
        color: "white", 
        padding: "8px 15px", 
        border: "none", 
        borderRadius: "4px",
        cursor: "pointer" 
      }}
    >
      Download PDF
    </button>
  );
};

export default ExportPDF;