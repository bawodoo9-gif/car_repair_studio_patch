odoo.define("car_repair_studio_patch.dashboard_actions", function (require) {
    "use strict";

    const FleetRepairDashboard = require("car_repair_industry.fleet_repair_dashboard");
    const { Domain } = require("@web/core/domain");

    FleetRepairDashboard.include({
        /**
         * Keep the database action id and its view/context configuration so
         * Studio can identify the action when opening a list or form.
         */
        _openStudioCompatibleAction: async function (ev, xmlId) {
            ev.preventDefault();
            const $card = $(ev.currentTarget);
            let cardDomain = $card.attr("data-domain");
            if (cardDomain === undefined) {
                // The upstream Assigned to Technicians card nests its domain.
                cardDomain = $card.find("[data-domain]").first().attr("data-domain");
            }
            const loadedAction = await this._rpc({
                route: "/web/action/load",
                params: { action_id: xmlId },
            });
            if (!loadedAction || loadedAction.type !== "ir.actions.act_window" || !loadedAction.id) {
                throw new Error("Could not load the Car Repair window action: " + xmlId);
            }
            const action = Object.assign({}, loadedAction);
            if (cardDomain) {
                // Retain restrictions added to the saved action by other addons.
                action.domain = Domain.and([action.domain || [], cardDomain]).toString();
            }
            return this.do_action(action, {
                on_reverse_breadcrumb: this.on_reverse_breadcrumb,
            });
        },

        clickCarRepair: function (ev) {
            return this._openStudioCompatibleAction(
                ev, "car_repair_industry.action_fleet_repair_tree_view"
            );
        },

        clickAssignedtoTechnicians: function (ev) {
            return this._openStudioCompatibleAction(
                ev, "car_repair_industry.action_fleet_diagnose_tree_view"
            );
        },

        clickCarDiagnosis: function (ev) {
            return this._openStudioCompatibleAction(
                ev, "car_repair_industry.action_fleet_diagnose_tree_view"
            );
        },

        clickWorkOrders: function (ev) {
            return this._openStudioCompatibleAction(
                ev, "car_repair_industry.action_fleet_workorder_tree_view"
            );
        },

        clickServiceType: function (ev) {
            return this._openStudioCompatibleAction(
                ev, "car_repair_industry.action_service_type"
            );
        },
    });

    return FleetRepairDashboard;
});