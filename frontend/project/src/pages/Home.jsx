import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign,
  PieChart,
  FileText,
  TrendingUp,
  Shield,
  Clock,
} from 'lucide-react';

const features = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Expense Tracking',
    description: 'Easily track and categorize all your business expenses in real-time.',
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: 'Financial Analytics',
    description: 'Get detailed insights with interactive charts and financial reports.',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'PDF Reports',
    description: 'Generate and download professional financial reports in PDF format.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Budget Management',
    description: 'Set and track budgets for different expense categories.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Secure Access',
    description: 'Enterprise-grade security with role-based access control.',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Real-time Updates',
    description: 'Stay updated with real-time financial data and notifications.',
  },
];

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
        >
          Manage Your Business Finances with Ease
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg leading-8 text-gray-600"
        >
          Streamline your financial operations with our comprehensive ERP solution.
          Track expenses, generate reports, and make informed decisions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Link
            to="/register"
            className="rounded-md bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-600"
          >
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage finances
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our comprehensive suite of tools helps you stay on top of your business finances
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-primary-600 px-6 py-12 sm:px-12 sm:py-16 rounded-2xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to streamline your finances?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
            Join thousands of businesses that trust FinanceERP for their financial management needs.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              className="rounded-md bg-white px-6 py-3 text-base font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="text-base font-semibold leading-6 text-white hover:text-primary-100"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
