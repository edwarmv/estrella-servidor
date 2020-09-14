import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Usuario } from 'entities/usuario';

define(Usuario, (faker: typeof Faker) => {
  const usuario = new Usuario();
  usuario.nombres = faker.name.firstName();
  usuario.apellidos = faker.name.lastName();
  usuario.correoElectronico = faker.internet.email();
  usuario.setPassword('qwerasdf');
  return usuario;
});
