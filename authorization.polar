# Allow the admin role to take any action on any resource
allow(actor, _action, _resource) if actor.role = "ADMIN";

allow(_actor, "GET",_links);