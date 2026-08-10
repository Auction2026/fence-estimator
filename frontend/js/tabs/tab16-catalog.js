import { formatCurrency } from '../utils.js';

export default {
  id: 'catalog',
  title: '16. Catalog',
  render(state) {
    const rows = (state.catalog || []).map(item => `
      <tr>
        <td>${item.sku}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.unit}</td>
        <td>${formatCurrency(item.price)}</td>
      </tr>`).join('');
    return `
      <section class="card">
        <h2>16. Catalog</h2>
        <p class="helper">Live catalog sample for the estimating engine and materials lookup workflow.</p>
      </section>
      <section class="catalog-table-wrapper">
        <table>
          <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Unit</th><th>Price</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    `;
  },
  bind() {}
};
