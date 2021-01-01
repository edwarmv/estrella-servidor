import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Usuario } from 'app/entities/usuario';

define(Usuario, (faker: typeof Faker) => {
  const usuario = new Usuario();

  usuario.nombre = faker.name.firstName();

  usuario.apellido = faker.name.lastName();

  usuario.nitCI = faker.random.number({ min: 1000000000 }).toString();

  usuario.telefonoFijo = faker.phone.phoneNumber();

  usuario.telefonoMovil = faker.phone.phoneNumber();

  const direccionDomicilio = `${faker.address.streetName()} -\
${faker.address.streetAddress()}`;
  usuario.direccionDomicilio = direccionDomicilio;

  usuario.coordenadasDireccionDomicilio =
    faker.random.number({ min: 1000000000 }).toString();

  usuario.correoElectronico = faker.internet.email();

  usuario.setPassword('qwerasdf');

  return usuario;
});
