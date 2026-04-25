import { useEffect, useState } from "react";
import api from "./services/api";
import ExportPDF from "./components/ExportPDF";

interface Product {
  id?: number,
  nama: string,
  deskripsi: string,
  stok: number | string,
  harga: number | string,
  tanggal_dibuat?: string,
  tanggal_diperbarui?: string,
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Product>({nama: '', deskripsi: '', stok: '', harga: ''})
  const [isEdit, setIsEdit] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [sortBy, setSortBy] = useState<"nama" | "stok" | "tanggal_diperbarui">("tanggal_diperbarui");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchProducts();
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data || [])
    } catch (error: any) {
      console.error("Gagal load data")
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg("")

    if (Number(form.stok) < 0 || Number(form.harga) < 0) {
      setErrorMsg("Stok atau harga tidak boleh bernilai negatif!");
      return;
    }

    try {
      const dataToSubmit = {
        nama: form.nama,
        deskripsi: form.deskripsi,
        stok: form.stok || 0,
        harga: form.harga || 0
      }

      if (isEdit && selectedId) {
        await api.put(`/products/${selectedId}`, dataToSubmit)
      } else {
        await api.post(`/products`, dataToSubmit)
      }

      resetForm()
      fetchProducts()
    } catch (error: any) {
      setErrorMsg(error.response?.data.message || "Terjadi kesalahan pada server")
    }
  }

  const handleEdit = (p: Product) => {
    if(!p.id) {
      console.error("ID produk tidak ditemukan");
      return
    }

    setIsEdit(true)
    setSelectedId(p.id!)
    setForm({nama: p.nama, deskripsi: p.deskripsi, stok: p.stok, harga: p.harga})
  }

  const handleDelete = async (id: number) => {
    if (confirm("Hapus barang ini?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  }

  const resetForm = () => {
    setForm({nama: "", deskripsi: "", stok: "", harga: ""});
    setIsEdit(false);
    setSelectedId(null)
  }

  const filteredProducts = products
    .filter((p) => p.nama?.toLowerCase().includes(search.toLowerCase()) ?? false)
    .sort((a, b) => {
      let valA = a[sortBy] ?? "";
      let valB = b[sortBy] ?? "";

    if (sortBy === "tanggal_diperbarui") {
      valA = new Date(a.tanggal_diperbarui || 0).getTime();
      valB = new Date(b.tanggal_diperbarui || 0).getTime();
    }

    if (order === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  return (
    <div style={{padding: "20px"}}>
      <h1>Manajemen Barang</h1>

      {errorMsg && <p style={{color: "red"}}>{errorMsg}</p>}

      <div>
        <input 
          placeholder="Cari barang..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        
        <ExportPDF data={filteredProducts} />
      </div>

      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Nama Barang"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value})}
          required
        />

        <textarea
          placeholder="Deskripsi Barang"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
        />

        <input
          placeholder="stok Barang"
          value={form.stok}
          onChange={(e) => setForm({ ...form, stok: e.target.value})}
        />

        <input 
          placeholder="Harga Barang"
          value={form.harga}
          onChange={(e) => setForm({ ...form, harga: e.target.value})}
        />

        <button type="submit">{isEdit ? "Update" : "Tambah"}</button>
        {isEdit && <button type="button" onClick={resetForm}>Batal</button>}
      </form>
        <div>
          <input 
            placeholder="Cari nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="tanggal_diperbarui">Urut: Terakhir Diperbarui</option>
            <option value="nama">Urut: Nama Barang</option>
            <option value="stok">Urut: Jumlah Stok</option>
          </select>

          <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
            {order === "asc" ? "Terlama/Terkecil" : "Terbaru/Terbesar"}
          </button>
        </div>

        <table border={1} width="100%">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Tanggal dibuat</th>
              <th>Tanggal diperbarui</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.nama}</td>
                  <td>{p.deskripsi}</td>
                  <td>{p.stok}</td>
                  <td>{p.harga}</td>
                  <td>{p.tanggal_dibuat ? new Date(p.tanggal_dibuat).toLocaleDateString() : '-'}</td>
                  <td>{p.tanggal_diperbarui ? new Date(p.tanggal_diperbarui).toLocaleString() : '-'}</td>
                  <td>
                    <button onClick={() => (handleEdit(p))}>Edit</button>
                    <button onClick={() => handleDelete(p.id!)}>Hapus</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{textAlign: "center"}}>Barangtidak ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      
    </div>
  )
}

export default App