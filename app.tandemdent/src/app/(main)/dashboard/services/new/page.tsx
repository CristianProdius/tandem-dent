import { NewServiceForm } from "./_components/new-service-form";

export default function NewServicePage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Adaugă serviciu nou</h1>
        <p className="text-muted-foreground">Adăugați un nou serviciu în catalogul clinicii.</p>
      </div>

      <NewServiceForm />
    </div>
  );
}
