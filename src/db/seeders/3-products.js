const { PRODUCT_TABLE } = require('../models/product.model');
module.exports = {
  up: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;

    return queryInterface.bulkInsert(PRODUCT_TABLE, [
      {
        name: 'Product 1',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'description 1',
        price: 100,
        category_id: 1,
        created_at: new Date(),
      },
      {
        name: 'Product 2',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'description 2',
        price: 150,
        category_id: 2,
        created_at: new Date(),
      },
      {
        name: 'Product 3',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'description 3',
        price: 110,
        category_id: 1,
        created_at: new Date(),
      },
      {
        name: 'Product 4',
        image: 'https://api.lorem.space/image/game?w=150&h=220',
        description: 'description 4',
        price: 110,
        category_id: 2,
        created_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    if (queryInterface.context) queryInterface = queryInterface.context;
    return queryInterface.bulkDelete(PRODUCT_TABLE, null, {});
  },
};
