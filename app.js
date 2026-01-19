import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { db } from "./conexion.js";

// ================== DOM ==================
const container = document.getElementById("container");
const panelProducts = document.getElementById("panel_products");
const panelventas = document.getElementById("panel_ventas");

const tableBody = document.getElementById("productsTableBody");
const ventaTableBody = document.getElementById("ventaTableBody");

const FormRegisterProduct = document.getElementById("FormRegisterProduct");
const btncancelregistroProduct = document.getElementById(
  "btncancelregistroProduct",
);

const inputProduct = document.getElementById("product");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const tableventas = document.getElementById("tableventas");
const submitBtn = FormRegisterProduct.querySelector("button[type='submit']");
const RegisterFormSales = document.getElementById("RegisterFormSales");
const selectproduct = document.getElementById("selectproduct");
const cantidad = document.getElementById("cantidad");
let editingId = null;
const listTableProducts = document.getElementById("listTableProducts");
const home = document.getElementById("home");
// ================== PRODUCTOS ==================

async function llenarSelect() {
  try {
    const querySnapshot = await getDocs(collection(db, "productos"));

    querySnapshot.forEach((doc) => {
      const data = doc.data(); // datos del documento
      const option = document.createElement("option");
      option.value = doc.id; // puedes usar el ID o algún campo
      option.textContent = data.producto; // el nombre que se vea en el select
      selectproduct.appendChild(option);
    });
  } catch (error) {
    console.error("Error al traer los productos:", error);
  }
}

llenarSelect();

async function getProducts() {
  try {
    const snapshot = await getDocs(collection(db, "productos"));
    const products = [];

    snapshot.forEach((d) => {
      products.push({ id: d.id, ...d.data() });
    });

    renderProducts(products);
  } catch (error) {
    console.error(error);
  }
}

async function guardarProducto(data) {
  try {
    await addDoc(collection(db, "productos"), {
      producto: data.product,
      precio: Number(data.price),
      stock: Number(data.stock),
      creadoEn: serverTimestamp(),
    });
    getProducts();
  } catch (error) {
    console.error(error);
  }
}

async function editarProducto(id, data) {
  try {
    await updateDoc(doc(db, "productos", id), {
      producto: data.product,
      precio: Number(data.price),
      stock: Number(data.stock),
    });
    getProducts();
  } catch (error) {
    console.error(error);
  }
}

async function eliminarProducto(id) {
  try {
    await deleteDoc(doc(db, "productos", id));
    getProducts();
  } catch (error) {
    console.error(error);
  }
}

// ================== VENTAS ==================
async function getVentas() {
  try {
    const snapshot = await getDocs(collection(db, "ventas"));
    const ventas = [];

    snapshot.forEach((d) => {
      ventas.push({ id: d.id, ...d.data() });
    });
    renderVentas(ventas);
  } catch (error) {
    console.error(error);
  }
}

// ================== RENDER ==================
function renderProducts(products) {
  tableBody.innerHTML = "";

  if (!products.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">No hay productos</td>
      </tr>
    `;
    return;
  }

  products.forEach((p) => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;

    tr.innerHTML = `
      <td>${p.producto}</td>
      <td>S/ ${Number(p.precio).toFixed(2)}</td>
      <td class="center ${p.stock < 5 ? "danger" : ""}">${p.stock}</td>
      <td><button class="edit center btnactions warning">✏️</button></td>
      <td><button class="delete center btnactions danger">🗑️</button></td>
    `;

    tableBody.appendChild(tr);
  });
}

function renderVentas(ventas) {
  ventaTableBody.innerHTML = "";

  if (!ventas.length) {
    ventaTableBody.innerHTML = `
      <tr>
        <td colspan="6">No hay ventas</td>
      </tr>
    `;
    return;
  }

  ventas.forEach((v) => {
    const tr = document.createElement("tr");
    tr.dataset.id = v.id;

    tr.innerHTML = `
      <td>${v.productoNombre}</td>
      <td>S/ ${Number(v.precio).toFixed(2)}</td>
      <td>${v.cantidad}</td>
      <td>S/ ${Number(v.total).toFixed(2)}</td>

      <td>
        <button class="delete btnactions danger">🗑️</button>
      </td>
    `;

    ventaTableBody.appendChild(tr);
  });
}

// ================== FORM ==================
function fillFormFromRow(e) {
  const tr = e.target.closest("tr");
  const tds = tr.children;

  FormRegisterProduct.classList.toggle("hiddenElement");
  listTableProducts.classList.toggle("hiddenElement");
  inputProduct.value = tds[0].textContent;
  inputPrice.value = tds[1].textContent.replace("S/ ", "");
  inputStock.value = tds[2].textContent;

  editingId = tr.dataset.id;
  submitBtn.textContent = "Editar";
}
// ================== EVENTS ==================
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnshowproducts")) {
    panelProducts.classList.remove("hiddenElement");
    home.classList.toggle("hiddenElement");
    getProducts();
  }

  if (e.target.classList.contains("btnshowventas")) {
    panelventas.classList.toggle("hiddenElement");
    home.classList.toggle("hiddenElement");
    getVentas();
  }

  if (e.target.classList.contains("btnNuevoProducto")) {
    FormRegisterProduct.reset();
    editingId = null;
    listTableProducts.classList.toggle("hiddenElement");
    FormRegisterProduct.classList.toggle("hiddenElement");
    submitBtn.textContent = "Guardar";
  }

  if (e.target.classList.contains("edit")) {
    fillFormFromRow(e);
  }

  if (e.target.classList.contains("btnregresarhome")) {
    
    home.classList.toggle("hiddenElement")
    panelventas.classList.toggle("hiddenElement");
  }

  if (e.target.classList.contains("regresarListProducts")) {
    panelProducts.classList.toggle("hiddenElement");
    home.classList.toggle("hiddenElement");
  }
  //canelarRegistroProducto

  if (e.target.classList.contains("canelarRegistroProducto")) {
    FormRegisterProduct.classList.add("hiddenElement");
    listTableProducts.classList.toggle("hiddenElement");
  }

  if (e.target.classList.contains("delete")) {
    const tr = e.target.closest("tr");
    const id = tr.dataset.id;

    if (confirm("¿Eliminar este producto?")) {
      eliminarProducto(id);
    }
  }

  if (e.target.classList.contains("ocultarventas")) {
    panelventas.classList.toggle("hiddenElement");
  }

  if (e.target.classList.contains("btnNuevoVenta")) {
    tableventas.classList.toggle("hiddenElement");
    RegisterFormSales.classList.toggle("hiddenElement");
  }

  if (e.target.classList.contains("btncancelarventa")) {
    tableventas.classList.toggle("hiddenElement");
    RegisterFormSales.classList.toggle("hiddenElement");
  }
});

//proceso para registrar datos de un producto :S
FormRegisterProduct.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(FormRegisterProduct).entries());

  //mostramos el listado de los productos registrados :S
  listTableProducts.classList.toggle("hiddenElement");

  //ocultamos el formulario de registros de los productos :S
  FormRegisterProduct.classList.toggle("hiddenElement");

  if (editingId) {
    await editarProducto(editingId, data);
  } else {
    await guardarProducto(data);
  }

  FormRegisterProduct.reset();
  editingId = null;
  submitBtn.textContent = "Guardar";
});

async function guardarVenta(data) {
  const selectedOption = selectproduct.options[selectproduct.selectedIndex];
  const productoId = selectedOption.value; // ID del producto
  const productoNombre = selectedOption.textContent; // Nombre

  const cantidadVendida = Number(data.cantidad);

  try {
    // 1️⃣ Guardar la venta
    await addDoc(collection(db, "ventas"), {
      productoId,
      productoNombre,
      precio: Number(data.precio),
      cantidad: cantidadVendida,
      total: Number(data.total),
      creadoEn: serverTimestamp(),
    });

    // 2️⃣ Reducir el stock del producto
    const productoRef = doc(db, "productos", productoId);
    const productoSnap = await getDocs(collection(db, "productos")); // O usar getDoc(productoRef)
    const productoData = (await getDoc(productoRef)).data(); // traer stock actual
    const nuevoStock = productoData.stock - cantidadVendida;

    // Actualizar el stock en Firestore
    await updateDoc(productoRef, { stock: nuevoStock });

    getVentas(); // refrescar tabla de ventas
    getProducts(); // refrescar tabla de productos
  } catch (error) {
    console.error("Error guardando venta o actualizando stock:", error);
  }
}

RegisterFormSales.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(RegisterFormSales).entries());
  RegisterFormSales.classList.toggle("hiddenElement");
  tableventas.classList.remove("hiddenElement");
  guardarVenta(data);
});

btncancelregistroProduct.addEventListener("click", () => {
  FormRegisterProduct.reset();
  editingId = null;
  submitBtn.textContent = "Guardar";
  FormRegisterProduct.classList.add("hiddenElement");
});

const total = document.getElementById("total");
const priceInput = document.getElementById("priceInput");
const montorecibido = document.getElementById("montorecibido");
const vuelto = document.getElementById("vuelto");
document.addEventListener("DOMContentLoaded", async () => {
  const productosData = {};

  try {
    const querySnapshot = await getDocs(collection(db, "productos"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      productosData[doc.id] = data; // guardamos el producto completo
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = data.producto || "Sin nombre";
      selectproduct.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }

  // Evento cuando cambias la selección
  selectproduct.addEventListener("change", () => {
    const selectedId = selectproduct.value;

    if (selectedId && productosData[selectedId]) {
      priceInput.value = productosData[selectedId].precio || "";
    } else {
      priceInput.value = "";
    }
    calcularTotal();
    CalcularVuelto();
  });

  calcularTotal();
});

function calcularTotal() {
  const txttotal = parseInt(priceInput.value) * parseInt(cantidad.value);
  total.value = parseInt(txttotal);
  console.log(txttotal);
}
cantidad.addEventListener("input", () => {
  if (cantidad.value !== "") {
    calcularTotal();
  }
});

function CalcularVuelto() {
  let txtvuelto = parseInt(montorecibido.value) - parseInt(priceInput.value);

  if (
    parseInt(montorecibido.value) < parseInt(priceInput.value) ||
    parseInt(priceInput.value) === 0
  ) {
    return (vuelto.textContent = "S/" + 0);
  }
  if (montorecibido.value === "") {
    vuelto.textContent = 0;
  } else {
    vuelto.textContent = "S/" + txtvuelto;
  }
}

montorecibido.addEventListener("input", () => {
  CalcularVuelto();
});
