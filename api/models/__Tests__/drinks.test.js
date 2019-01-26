const Drinks = require('../drinks');

describe('the "Drinks" model', () => {
  it('Should throw an error is name is empty', (done) => {
    const drink = new Drinks();
    drink.validate((err) => {
      expect(err.errors).toHaveProperty('name');
      expect(err.errors).toHaveProperty('bbId');
      expect(err.errors).toHaveProperty('userId');
      done();
    });
  });

  it('Should not throw an error when all fields are present', (done) => {
    const drink = new Drinks(
      {
        userId: 'Some ID',
        bbId: 'some ID',
        name: 'Jay',
      },
    );
    drink.validate((err) => {
      expect(err).toBeNull();
      done();
    });
  });
});
