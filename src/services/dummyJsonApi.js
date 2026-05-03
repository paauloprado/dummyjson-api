const BASE_URL = 'https://dummyjson.com';

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os dados.');
  }

  return response.json();
}

export function getProducts() {
  return request('/products?limit=30');
}

export function getProductById(productId) {
  return request(`/products/${productId}`);
}
