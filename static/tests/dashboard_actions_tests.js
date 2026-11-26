odoo.define("car_repair_studio_patch.dashboard_actions_tests", function (require) {
    "use strict";

    const Dashboard = require("car_repair_studio_patch.dashboard_actions");
    const { Domain } = require("@web/core/domain");

    QUnit.module("car_repair_studio_patch");

    function harness(action) {
        const calls = [];
        const instance = Object.create(Dashboard.prototype);
        instance._rpc = async function (request) {
            calls.push(request);
            return action;
        };
        instance.do_action = async function (opened, options) {
            calls.push({ opened, options });
            return "opened";
        };
        return { instance, calls };
    }

    const routes = [
        ["clickCarRepair", "action_fleet_repair_tree_view"],
        ["clickAssignedtoTechnicians", "action_fleet_diagnose_tree_view"],
        ["clickCarDiagnosis", "action_fleet_diagnose_tree_view"],
        ["clickWorkOrders", "action_fleet_workorder_tree_view"],
        ["clickServiceType", "action_service_type"],
    ];

    for (const [handler, actionId] of routes) {
        QUnit.test(handler + " retains the saved action", async function (assert) {
            const action = {
                id: 42, type: "ir.actions.act_window",
                views: [[10, "tree"], [11, "form"]],
                context: "{'default_company_id': 1}",
                domain: "[('company_id', '=', 1)]",
            };
            const { instance, calls } = harness(action);
            const card = $("<a/>")[0];
            let prevented = false;
            const result = await instance[handler]({
                currentTarget: card, preventDefault() { prevented = true; },
            });
            assert.ok(prevented);
            assert.strictEqual(result, "opened");
            assert.deepEqual(calls[0], {
                route: "/web/action/load",
                params: { action_id: "car_repair_industry." + actionId },
            });
            assert.deepEqual(calls[1].opened, action);
            assert.notStrictEqual(calls[1].opened, action, "Does not mutate loaded action");
        });
    }

    for (const nested of [false, true]) {
        QUnit.test("Card filter, nested=" + nested, async function (assert) {
            const state = nested ? "in_progress" : "done";
            const action = {
                id: 42, type: "ir.actions.act_window",
                domain: "[('company_id', '=', 1)]",
            };
            const { instance, calls } = harness(action);
            const card = $("<a/>");
            const target = nested ? $("<div/>").appendTo(card) : card;
            target.attr("data-domain", "[('state', '=', '" + state + "')]");
            const handler = nested ? "clickAssignedtoTechnicians" : "clickCarRepair";
            await instance[handler]({ currentTarget: card[0], preventDefault() {} });
            const domain = new Domain(calls[1].opened.domain);
            assert.ok(domain.contains({ company_id: 1, state }));
            assert.notOk(domain.contains({ company_id: 2, state }));
            assert.notOk(domain.contains({ company_id: 1, state: "other" }));
            assert.strictEqual(action.domain, "[('company_id', '=', 1)]");
            assert.strictEqual(calls[1].opened.id, 42);
        });
    }

    QUnit.test("Missing action does not open an anonymous fallback", async function (assert) {
        const { instance, calls } = harness(false);
        await assert.rejects(instance.clickCarRepair({
            currentTarget: $("<a/>")[0], preventDefault() {},
        }), /Could not load/);
        assert.strictEqual(calls.length, 1);
    });
});