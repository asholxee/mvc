const express = require('express');
const { sequelize, Category, Supplier, Product } = require('./models');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const products = await Product.findAll({ include: [Category, Supplier] });
  res.render('index', { products });
});

app.get('/product', async (req, res) => {
  const categories = await Category.findAll();
  const suppliers = await Supplier.findAll();
  res.render('product-form', { product: null, categories, suppliers });
});

app.get('/product/:id', async (req, res) => {
  const categories = await Category.findAll();
  const suppliers = await Supplier.findAll();
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).send('Товар не найден');
  res.render('product-form', { product, categories, suppliers });
});

app.post('/product', async (req, res) => {
  const { name, price, categoryId, supplierId } = req.body;
  await Product.create({ name, price, CategoryId: categoryId, SupplierId: supplierId });
  res.redirect('/');
});

app.post('/product/:id', async (req, res) => {
  const { name, price, categoryId, supplierId } = req.body;
  await Product.update(
    { name, price, CategoryId: categoryId, SupplierId: supplierId },
    { where: { id: req.params.id } }
  );
  res.redirect('/');
});

app.post('/delete-product/:id', async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});

(async () => {
  try {
    await sequelize.sync({ force: true });
    const cat1 = await Category.create({ name: 'Электроника' });
    const cat2 = await Category.create({ name: 'Книги' });
    const sup1 = await Supplier.create({ name: 'TechCorp', contact: 'techcorpexample.com' });
    const sup2 = await Supplier.create({ name: 'BookStore', contact: 'contactbookstore.com' });

    await Product.create({ name: 'Ноутбук', price: 1200.99, CategoryId: cat1.id, SupplierId: sup1.id });
    await Product.create({ name: 'Смартфон', price: 799.49, CategoryId: cat1.id, SupplierId: sup1.id });
    await Product.create({ name: 'Научная фантастика', price: 19.99, CategoryId: cat2.id, SupplierId: sup2.id });

    app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
  } catch (err) {
    console.error('Ошибка запуска:', err);
  }
})();
