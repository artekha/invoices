import {
  getData,
  postData,
  putData,
  deleteData
} from './helpers';


export const getProducts = () =>
  getData('products');

export const getCustomers = () =>
  getData('customers');

export const getCustomer = id =>
  getData(`customers/${id}`);

export const createCustomer = data =>
  postData('customers');

export const deleteCustomer = id =>
  deleteData(`customers/${id}`);

export const getInvoices = () =>
  getData('invoices');

export const getInvoice = id =>
  getData(`invoices/${id}`);

export const createInvoice = data =>
  postData('invoices');

export const updateInvoice = (id, data) =>
  putData(`invoices/${id}`, data);

export const deleteInvoice = id =>
  deleteData(`invoices/${id}`);

export const getInvoiceItems = id =>
  getData(`invoices/${id}/items`);

export const createInvoiceItem = (id, data) =>
  postData(`invoices/${id}/items`, data);

export const updateInvoiceItem = (invoiceId, id, data) =>
  putData(`invoices/${invoiceId}/items/${id}`, data);

export const deleteInvoiceItem = (invoiceId, id) =>
  deleteData(`invoices/${invoiceId}/items/${id}`);
