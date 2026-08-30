# MindMirror — Curriculum & Role Architecture Demo

## Roles

### User
- Runs the learning experience.
- Chooses language, training type and scenario.
- Never receives curriculum editing controls.

### Admin
- Opens `/admin`.
- Signs in to the protected Curriculum Portal.
- Edits/publishes curriculum content by training type and language.
- Can reset a language version to the bundled demo content.

## Recommended production architecture

```text
User App (/)
   |
   +--> Training Engine --> Curriculum API --> Published Content

Admin Portal (/admin)
   |
   +--> SSO/OIDC --> RBAC: curriculum_editor/admin
                    |
                    +--> Draft -> Review -> Publish -> Curriculum API
```

For production, do not rely on a hidden URL or localStorage for authorization. The server/API must enforce the admin role. A hidden `/admin` URL is useful as a route, but not as a security mechanism.

## Multilingual content

Each language has a separate content bundle:

- `en` — English
- `id` — Bahasa Indonesia
- `nl` — Nederlands

The roleplay service receives the selected `language` and loads the matching curriculum. Therefore the participant-facing dialogue does not fall back to English when Indonesian or Dutch is selected.

## Demo persistence

The demo saves curriculum overrides to browser localStorage using a language + training-type key. This demonstrates swappable content without touching UI code. A real product should replace this with a database/CMS-backed Curriculum API with versioning, audit history and publishing workflow.
