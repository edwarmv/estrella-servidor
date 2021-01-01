import { Menu } from 'app/entities/menu';
import Faker from 'faker';
import { define } from 'typeorm-seeding';

define(Menu, (faker: typeof Faker) => {
  const menu = new Menu();
  menu.nombre = faker.name.title();

  return menu;
});
