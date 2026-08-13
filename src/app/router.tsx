import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { CheckoutErrorPage } from '@/pages/CheckoutErrorPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage'
import { HomePage } from '@/pages/HomePage'
import { PlansPage } from '@/pages/PlansPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { TermsPage } from '@/pages/TermsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="planos" element={<PlansPage />} />
          <Route path="checkout/:plano" element={<CheckoutPage />} />
          <Route path="checkout/sucesso" element={<CheckoutSuccessPage />} />
          <Route path="checkout/erro" element={<CheckoutErrorPage />} />
          <Route path="termos" element={<TermsPage />} />
          <Route path="privacidade" element={<PrivacyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
