import { Request, Response } from "express";
import BaseController from "./BaseController.js";


class ProductController extends BaseController {
    public getAllProducts = async (req: Request, res: Response) => {
        try {
            const [rows] = await this.db.query("SELECT * FROM products ORDER BY tanggal_diperbarui DESC")
            return this.sendSuccess(res, rows, "Data barang berhasil diambil")
        } catch (error: any) {
            return res.status(500).json({error: error.message})
        }
    }

    public createProduct = async (req: Request, res: Response) => {
        const {nama, deskripsi, stok, harga} = req.body

        const [existing]: any = await this.db.query("SELECT id FROM products WHERE nama = ?", [nama]);
        
        if (existing.length > 0) {
            return res.status(400).json({ message: "Nama barang sudah ada di database!" });
        }

        if (!nama || nama.trim() === "") {
            return res.status(400).json({message: "Nama barang wajib diisi"})
        }
        if (stok < 0 || harga < 0) {
            return res.status(400).json({message: "Stok atau harga tidak boleh negatif"})
        }

        try {
            const query = "INSERT INTO products (nama, deskripsi, stok, harga) VALUES (?, ?, ?, ?)"
            await this.db.query(query, [nama, deskripsi, Number(stok), Number(harga)])
            return this.sendSuccess(res, null, "Barang berhasil ditambahkan")
        } catch (error: any) {
            return res.status(500).json({message: error.message})
        }
    }

    public updateProduct = async (req: Request, res: Response) => {
        const { id } = req.params
        const {nama, deskripsi, stok, harga} = req.body

        if (!nama || nama.trim() === "") {
            return res.status(400).json({message: "Nama barang wajib diisi"})
        }
        if (stok < 0 || harga < 0) {
            return res.status(400).json({message: "Stok atau harga tidak boleh negatif"})
        }

        const [duplicate]: any = await this.db.query(
            "SELECT id FROM products WHERE nama = ? AND id != ?", 
            [nama, id]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({ message: "Gagal Update! Nama barang ini sudah digunakan oleh produk lain." });
        }
        
        try {
            const query = "UPDATE products SET nama = ?, deskripsi = ?, stok = ?, harga = ? WHERE id = ?"
            const [result]: any = await this.db.query(query, [nama, deskripsi, Number(stok), Number(harga), id])

            if (result.affectedRows === 0){
                return res.status(404).json({message: "Barang tidak dtiemukan atau barang tidak ada perubahan data"})
            }

            return this.sendSuccess(res, null, "Barang berhasil diperbarui")
        } catch (error: any) {
            return res.status(500).json({message: error.message})
        }
    }

    public deleteProduct = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const query = "DELETE FROM products WHERE id = ?"
            await this.db.query(query, [id])
            return this.sendSuccess(res, null, "Barang berhasil dihapus")
        } catch (error: any) {
            return res.status(500).json({message: error.message})
        }
    }
}

export default new ProductController();