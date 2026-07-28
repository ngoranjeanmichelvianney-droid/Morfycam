// app/register/page.js
//
// Server Component volontairement minimal : useSearchParams() (utilisé
// pour lire ?ref=CODE dans RegisterForm) ne peut être pré-rendu qu'à
// l'intérieur d'un <Suspense>, sinon le build Next.js échoue avec
// "useSearchParams() should be wrapped in a suspense boundary".

import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}