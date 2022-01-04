import {app} from "@app/index";
import {createCategory} from "@handlers/categories/create";
import {listCategories} from "@handlers/categories/list";
import {deleteCategories} from "@handlers/categories/delete";
import {syncCategories} from "@handlers/categories/sync";

app.on('categories :spaceRoleId sync ?except', syncCategories)
app.on('categories :spaceRoleId create :name', createCategory)
app.on('categories :spaceRoleId delete :categoryId', deleteCategories)
app.on('categories :spaceRoleId list', listCategories)