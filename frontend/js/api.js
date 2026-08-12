/**
 * FENCE DEPOT ESTIMATOR - API Communication
 * frontend/js/api.js
 */

'use strict';

var API = (function () {

  var BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001/api'
    : '/api';

  // ---- Private helpers ----
  function getToken() {
    return localStorage.getItem('fe_token') || '';
  }

  function headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': getToken() ? 'Bearer ' + getToken() : '',
    };
  }

  async function request(method, endpoint, body) {
    var opts = { method: method, headers: headers() };
    if (body) opts.body = JSON.stringify(body);
    try {
      UI.showLoading();
      var res = await fetch(BASE_URL + endpoint, opts);
      var data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed (' + res.status + ')');
      return data;
    } catch (err) {
      UI.showToast(err.message, 'error');
      throw err;
    } finally {
      UI.hideLoading();
    }
  }

  // ---- AUTH ----
  async function login(username, password) {
    var data = await request('POST', '/auth/login', { username, password });
    if (data.token) {
      localStorage.setItem('fe_token', data.token);
      localStorage.setItem('fe_user', JSON.stringify(data.user));
      FenceApp.isLoggedIn = true;
      FenceApp.user = data.user;
    }
    return data;
  }

  async function logout() {
    localStorage.removeItem('fe_token');
    localStorage.removeItem('fe_user');
    FenceApp.isLoggedIn = false;
    FenceApp.user = null;
    UI.showToast('Logged out', 'info');
  }

  async function register(userData) {
    return request('POST', '/auth/register', userData);
  }

  // ---- PROJECTS ----
  async function getProjects() {
    return request('GET', '/projects');
  }

  async function getProject(id) {
    return request('GET', '/projects/' + id);
  }

  async function createProject(data) {
    return request('POST', '/projects', data);
  }

  async function updateProject(id, data) {
    return request('PUT', '/projects/' + id, data);
  }

  async function deleteProject(id) {
    return request('DELETE', '/projects/' + id);
  }

  // ---- ESTIMATES ----
  async function calculateEstimate(specsData) {
    return request('POST', '/estimates/calculate', specsData);
  }

  async function saveEstimate(projectId, estimateData) {
    return request('POST', '/projects/' + projectId + '/estimate', estimateData);
  }

  async function getEstimate(projectId) {
    return request('GET', '/projects/' + projectId + '/estimate');
  }

  // ---- CONTRACTS ----
  async function lockContract(projectId) {
    return request('POST', '/projects/' + projectId + '/contract/lock');
  }

  async function saveSignature(projectId, signatureData) {
    return request('POST', '/projects/' + projectId + '/contract/signature', { signature: signatureData });
  }

  // ---- CHANGE ORDERS ----
  async function createChangeOrder(projectId, orderData) {
    return request('POST', '/projects/' + projectId + '/change-orders', orderData);
  }

  async function updateChangeOrder(projectId, orderId, orderData) {
    return request('PUT', '/projects/' + projectId + '/change-orders/' + orderId, orderData);
  }

  // ---- PRODUCTS / CATALOG ----
  async function getProducts(query, category) {
    var params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    return request('GET', '/products?' + params.toString());
  }

  async function getProduct(id) {
    return request('GET', '/products/' + id);
  }

  // ---- PDF GENERATION ----
  async function generatePDF(projectId, type) {
    var res = await fetch(BASE_URL + '/projects/' + projectId + '/pdf/' + type, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + getToken() },
    });
    if (!res.ok) throw new Error('PDF generation failed');
    var blob = await res.blob();
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = type + '-' + projectId + '.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---- EMAIL ----
  async function sendEmail(projectId, type, recipientEmail) {
    return request('POST', '/projects/' + projectId + '/email', { type, recipientEmail });
  }

  // ---- ADMIN ----
  async function getStats() {
    return request('GET', '/admin/stats');
  }

  async function getUsers() {
    return request('GET', '/admin/users');
  }

  // Expose public API
  return {
    login, logout, register,
    getProjects, getProject, createProject, updateProject, deleteProject,
    calculateEstimate, saveEstimate, getEstimate,
    lockContract, saveSignature,
    createChangeOrder, updateChangeOrder,
    getProducts, getProduct,
    generatePDF, sendEmail,
    getStats, getUsers,
  };

})();

window.API = API;
