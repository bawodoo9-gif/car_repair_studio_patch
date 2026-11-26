# Car Repair - Studio Compatibility (Odoo 16)

## Alcance

Permite abrir las listas y formularios desde las tarjetas del dashboard usando
las acciones de ventana guardadas de car_repair_industry. Conserva sus IDs,
vistas y contexto, que las acciones anónimas del dashboard original omitían.

El dashboard JavaScript conserva su diseño. Studio seguirá deshabilitado en
la pantalla del dashboard; estará disponible en las vistas compatibles abiertas
desde sus tarjetas, con los permisos habituales de Studio.

Incluye Reparaciones, Finalizadas, Diagnósticos, Asignados a técnicos,
Órdenes de trabajo y Tipos de servicio. Combina el dominio de cada tarjeta
con el de la acción guardada. También lee el dominio anidado de la tarjeta
Asignados a técnicos (state = in_progress).

## Instalación

1. Incluir la carpeta padre de este módulo en addons_path.
2. Reiniciar Odoo 16 y actualizar la lista de aplicaciones.
3. Instalar Car Repair - Studio Compatibility (car_repair_studio_patch).
   Requiere car_repair_industry y web_studio (Enterprise).
4. Recargar el navegador para cargar los nuevos assets.

No modifica los archivos del módulo original ni agrega permisos, modelos o
reglas de acceso. Al desinstalarlo y recargar los assets vuelve la navegación
original. Las personalizaciones guardadas por Studio se administran por separado.

## Validación en Odoo

Con un usuario autorizado para Studio:
- Abrir cada una de las seis tarjetas y comprobar lista y formulario.
- Abrir Studio, guardar una personalización de prueba y comprobarla al reabrir.
- Comprobar que Finalizadas muestra state = done y Asignados a técnicos muestra
  state = in_progress.
- Volver al dashboard mediante la ruta de navegación.
- Verificar que se siguen respetando las reglas de acceso de cada modelo.

Las pruebas QUnit se incluyen en web.qunit_suite_tests. Ejecutarlas en una
base de pruebas con el módulo instalado desde /web/tests y filtrar por
car_repair_studio_patch. Cubren acciones persistentes, las cinco rutas,
dominios de ambas tarjetas y fallo de carga. Requieren el entorno web de Odoo;
no sustituyen la comprobación de guardar cambios con Studio Enterprise.

Referencias:
- https://www.odoo.com/documentation/16.0/developer/reference/backend/actions.html
- https://github.com/odoo/odoo/blob/16.0/addons/web/controllers/action.py