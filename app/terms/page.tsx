import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 6, 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using SmoothSend Demo ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              SmoothSend is a gasless transaction infrastructure for the Aptos blockchain. The Service allows users 
              to send tokens without holding APT for gas fees. This demo application showcases the SmoothSend protocol 
              capabilities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You are responsible for maintaining the security of your wallet and private keys</li>
              <li>You must ensure all transaction details are correct before signing</li>
              <li>You agree not to use the Service for any illegal or unauthorized purposes</li>
              <li>You understand that blockchain transactions are irreversible</li>
              <li>You are responsible for any fees associated with your transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Transaction Fees</h2>
            <p className="text-muted-foreground leading-relaxed">
              SmoothSend may deduct a small service fee from the tokens being transferred to cover gas costs 
              and operational expenses. The exact fee amount will be displayed before you confirm any transaction. 
              By proceeding with a transaction, you agree to the displayed fee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. No Custody of Funds</h2>
            <p className="text-muted-foreground leading-relaxed">
              SmoothSend is a non-custodial service. We never have access to, custody of, or control over your 
              private keys, wallet, or funds. All transactions are executed directly on the Aptos blockchain 
              through your own wallet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Blockchain Risks</h2>
            <p className="text-muted-foreground leading-relaxed">
              You acknowledge and accept the inherent risks of blockchain technology, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Network congestion and transaction delays</li>
              <li>Smart contract vulnerabilities</li>
              <li>Token price volatility</li>
              <li>Regulatory changes affecting cryptocurrency usage</li>
              <li>Potential loss of funds due to user error or technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, SmoothSend and its operators shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses 
              resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain high availability but do not guarantee uninterrupted access to the Service. 
              We may modify, suspend, or discontinue the Service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Modifications to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
              posting to the website. Your continued use of the Service after any changes constitutes acceptance 
              of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard 
              to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:contact@smoothsend.xyz" className="text-primary hover:underline">
                contact@smoothsend.xyz
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link 
            href="/" 
            className="text-primary hover:underline"
          >
            ← Back to App
          </Link>
        </div>
      </div>
    </div>
  )
}
