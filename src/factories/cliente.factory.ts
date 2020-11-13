import { define } from 'typeorm-seeding';
import { Cliente } from 'entities/cliente';
import Faker from 'faker';

define(Cliente, (faker: typeof Faker) => {

  const cliente = new Cliente();

  cliente.nombre = faker.name.firstName();

  cliente.apellido = faker.name.lastName();

  cliente.nitCI = faker.random.number({ min: 1000000000 }).toString();

  cliente.telefonoFijo = faker.phone.phoneNumber();

  cliente.telefonoMovil = faker.phone.phoneNumber();

  const direccionDomicilio = `${faker.address.streetName()} -\
${faker.address.streetAddress()}`;
  cliente.direccionDomicilio = direccionDomicilio;

  cliente.coordenadasDireccionDomicilio =
    faker.random.number({ min: 1000000000 }).toString();

  return cliente;
});
