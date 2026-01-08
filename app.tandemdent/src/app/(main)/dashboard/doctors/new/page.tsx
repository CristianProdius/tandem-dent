import { NewDoctorForm } from "./_components/new-doctor-form";

export default function NewDoctorPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Adaugă medic nou</h1>
        <p className="text-muted-foreground">Adăugați un nou medic la clinică.</p>
      </div>

      <NewDoctorForm />
    </div>
  );
}
