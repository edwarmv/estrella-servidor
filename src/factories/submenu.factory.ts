import { define } from 'typeorm-seeding';
import { Submenu } from 'entities/submenu';
import Faker from 'faker';

define(Submenu, (faker: typeof Faker) => {
  const submenu = new Submenu();
  submenu.nombre = faker.name.title();
  submenu.path = `/${faker.name.jobType().toLowerCase()}`;

  return submenu;
});
