import {app} from "@app/index";
import {createCategory} from "@handlers/categories/create";
import {listCategories} from "@handlers/categories/list";
import {deleteCategories} from "@handlers/categories/delete";
import {syncCategories} from "@handlers/categories/sync";

app.on('categories :spaceRoleId sync ?except', syncCategories).middleware('auth')
app.on('categories :spaceRoleId create :name', createCategory).middleware('auth')
app.on('categories :spaceRoleId delete :categoryId', deleteCategories).middleware('auth')
app.on('categories :spaceRoleId list', listCategories).middleware('auth')