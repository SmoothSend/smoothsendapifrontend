import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
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

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 6, 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              SmoothSend ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, and safeguard information when you use our demo application 
              and gasless transaction service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Wallet Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you connect your wallet to SmoothSend, we receive your public wallet address. We do not 
              have access to your private keys, seed phrases, or the ability to control your wallet.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Transaction Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              We process transaction requests that you submit, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Sender wallet address (your address)</li>
              <li>Recipient wallet address</li>
              <li>Token type and amount</li>
              <li>Transaction signatures</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Note: All transaction data is publicly visible on the Aptos blockchain by nature of blockchain technology.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">2.3 Technical Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may collect standard technical information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>IP address (for rate limiting and security purposes)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage patterns and interaction data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Process and relay your gasless transactions</li>
              <li>Prevent fraud and abuse of our service</li>
              <li>Implement rate limiting to ensure fair usage</li>
              <li>Improve and optimize our service</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your information. 
              Transaction records may be stored temporarily for operational purposes and debugging. 
              We use industry-standard encryption and security practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>To comply with legal requirements or court orders</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>With service providers who assist in operating our infrastructure (under strict confidentiality)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Blockchain Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Please be aware that blockchain transactions are inherently public and transparent. 
              Once a transaction is recorded on the Aptos blockchain, it becomes part of the permanent 
              public record. We have no ability to delete or modify blockchain data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use essential cookies and local storage for functional purposes such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Remembering your wallet connection preferences</li>
              <li>Maintaining your session state</li>
              <li>Theme and display preferences</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your jurisdiction, you may have rights including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data (where technically feasible and not on blockchain)</li>
              <li>Objection to certain processing</li>
              <li>Data portability</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service may integrate with third-party wallet providers and blockchain infrastructure. 
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Service is not intended for individuals under the age of 18. We do not knowingly 
              collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
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
